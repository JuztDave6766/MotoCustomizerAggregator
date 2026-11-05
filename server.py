#!/usr/bin/env python3
"""
MotoLab — server locale di sviluppo.

Serve i file statici e offre /api/preview?url=... per leggere i metadati
OpenGraph (titolo, immagine, prezzo) di una pagina prodotto.

Uso:
    python3 server.py            # http://localhost:8000
    python3 server.py 8080       # porta personalizzata

Solo libreria standard, nessuna dipendenza.
"""

from __future__ import annotations

import ipaddress
import json
import re
import socket
import sys
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

MAX_BYTES = 1_500_000
MAX_IMAGE_BYTES = 8_000_000
TIMEOUT = 8
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36 MotoLab/1.0"
)
ALLOWED_SCHEMES = ("http", "https")


def is_public_host(host: str) -> bool:
    """Blocca richieste verso indirizzi privati/locali (SSRF di base)."""
    try:
        infos = socket.getaddrinfo(host, None)
    except OSError:
        return False
    for info in infos:
        addr = info[4][0]
        try:
            ip = ipaddress.ip_address(addr)
        except ValueError:
            return False
        if (
            ip.is_private
            or ip.is_loopback
            or ip.is_link_local
            or ip.is_reserved
            or ip.is_multicast
            or ip.is_unspecified
        ):
            return False
    return True


def fetch_html(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ALLOWED_SCHEMES:
        raise ValueError("protocollo non supportato")
    if not parsed.hostname or not is_public_host(parsed.hostname):
        raise ValueError("host non raggiungibile o non pubblico")

    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "it-IT,it;q=0.9,en;q=0.6",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            ctype = resp.headers.get_content_type()
            if ctype not in ("text/html", "application/xhtml+xml"):
                raise ValueError("la pagina non è HTML (%s)" % ctype)
            raw = resp.read(MAX_BYTES)
            charset = resp.headers.get_content_charset() or "utf-8"
    except urllib.error.HTTPError as exc:
        raise ValueError("il negozio ha risposto %s" % exc.code) from exc
    except urllib.error.URLError as exc:
        raise ValueError("connessione fallita: %s" % exc.reason) from exc
    except TimeoutError as exc:
        raise ValueError("timeout del negozio") from exc

    return raw.decode(charset, errors="replace")


def fetch_image(url: str) -> tuple[bytes, str]:
    """Scarica un'immagine pubblica per il collage (proxy same-origin)."""
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ALLOWED_SCHEMES:
        raise ValueError("protocollo non supportato")
    if not parsed.hostname or not is_public_host(parsed.hostname):
        raise ValueError("host non raggiungibile o non pubblico")

    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8",
            "Referer": "%s://%s/" % (parsed.scheme, parsed.netloc),
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            ctype = resp.headers.get_content_type()
            if not ctype.startswith("image/"):
                raise ValueError("la risorsa non è un'immagine (%s)" % ctype)
            raw = resp.read(MAX_IMAGE_BYTES + 1)
            if len(raw) > MAX_IMAGE_BYTES:
                raise ValueError("immagine troppo grande")
            return raw, ctype
    except urllib.error.HTTPError as exc:
        raise ValueError("il negozio ha risposto %s" % exc.code) from exc
    except urllib.error.URLError as exc:
        raise ValueError("connessione fallita: %s" % exc.reason) from exc
    except TimeoutError as exc:
        raise ValueError("timeout del negozio") from exc


def parse_meta(html: str) -> dict[str, str]:
    """Raccoglie tutte le meta tag property/name -> content."""
    out: dict[str, str] = {}
    for tag in re.findall(r"<meta\b[^>]*>", html, flags=re.I):
        attrs = dict(
            (k.lower(), v)
            for k, v in re.findall(
                r'([a-zA-Z:-]+)\s*=\s*["\']([^"\']*)["\']', tag
            )
        )
        key = (attrs.get("property") or attrs.get("name") or "").lower()
        content = attrs.get("content")
        if key and content and key not in out:
            out[key] = content
    return out


def parse_price(html: str, meta: dict[str, str]) -> float | None:
    candidates: list[str] = []

    for key in (
        "product:price:amount",
        "og:price:amount",
        "product:sale_price:amount",
        "price",
    ):
        if key in meta:
            candidates.append(meta[key])

    # JSON-LD (offers.price) e microdati
    for match in re.finditer(
        r'"price"\s*:\s*"?([0-9]+(?:[.,][0-9]{1,2})?)"?', html
    ):
        candidates.append(match.group(1))
    for match in re.finditer(
        r'itemprop\s*=\s*["\']price["\'][^>]*content\s*=\s*["\']([^"\']+)',
        html,
        flags=re.I,
    ):
        candidates.append(match.group(1))

    for value in candidates:
        cleaned = value.strip().replace("\u00a0", "").replace(" ", "")
        if "," in cleaned and "." in cleaned:
            if cleaned.rfind(",") > cleaned.rfind("."):
                # 1.299,00 -> 1299.00
                cleaned = cleaned.replace(".", "").replace(",", ".")
            else:
                # 1,299.00 -> 1299.00
                cleaned = cleaned.replace(",", "")
        else:
            cleaned = cleaned.replace(",", ".")
        try:
            number = float(cleaned)
        except ValueError:
            continue
        if 0 < number < 500_000:
            return round(number, 2)
    return None


def absolute_image(src: str, base: str) -> str:
    if not src:
        return ""
    return urllib.parse.urljoin(base, src)


def build_preview(url: str) -> dict:
    html = fetch_html(url)
    meta = parse_meta(html)

    title = (
        meta.get("og:title")
        or meta.get("twitter:title")
        or ""
    ).strip()
    if not title:
        m = re.search(r"<title[^>]*>(.*?)</title>", html, flags=re.I | re.S)
        title = re.sub(r"\s+", " ", m.group(1)).strip() if m else ""

    image = (
        meta.get("og:image")
        or meta.get("og:image:secure_url")
        or meta.get("twitter:image")
        or ""
    )
    image = absolute_image(image, url)

    site = meta.get("og:site_name") or urllib.parse.urlparse(url).hostname or ""

    price = parse_price(html, meta)

    return {
        "ok": True,
        "url": url,
        "title": title[:180] or urllib.parse.urlparse(url).path.rsplit("/", 1)[-1],
        "image": image,
        "site": site,
        "price": price if price is not None else 0,
        "currency": meta.get("product:price:currency", "EUR"),
    }


class Handler(SimpleHTTPRequestHandler):
    server_version = "MotoLab/1.0"

    def end_headers(self) -> None:
        self.send_header("Cache-Control", getattr(self, "_cache_control", None) or "no-store")
        super().end_headers()

    def do_GET(self) -> None:  # noqa: N802
        self._cache_control = None
        parsed = urllib.parse.urlparse(self.path)

        if parsed.path == "/api/preview":
            params = urllib.parse.parse_qs(parsed.query)
            target = (params.get("url") or [""])[0].strip()
            if not target:
                self._json({"error": "parametro url mancante"}, status=400)
                return
            try:
                self._json(build_preview(target))
            except ValueError as exc:
                self._json({"error": str(exc)}, status=422)
            except Exception as exc:  # pragma: no cover - rete imprevedibile
                self._json({"error": "lettura non riuscita: %s" % exc}, status=502)
            return

        if parsed.path == "/api/image":
            params = urllib.parse.parse_qs(parsed.query)
            target = (params.get("url") or [""])[0].strip()
            if not target:
                self.send_error(400, "parametro url mancante")
                return
            try:
                body, ctype = fetch_image(target)
            except ValueError as exc:
                self.send_error(422, str(exc))
                return
            except Exception:  # pragma: no cover - rete imprevedibile
                self.send_error(502, "lettura immagine non riuscita")
                return
            self._cache_control = "public, max-age=3600"
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        super().do_GET()

    def _json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("[MotoLab] %s\n" % (fmt % args))


def main() -> None:
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            sys.exit("Porta non valida: %s" % sys.argv[1])

    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print("MotoLab pronto su http://localhost:%d" % port)
    print("Premi Ctrl+C per fermare il server.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nChiuso.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
