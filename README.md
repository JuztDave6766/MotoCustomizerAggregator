# MotoLab — configuratore visivo per la tua moto

Prototipo funzionante di un configuratore web: scegli il modello, applichi un tema,
monti scarico, sella, cerchi, parafango, specchietti, cupolino e livrea, e vedi la moto
aggiornarsi in tempo reale con il preventivo e i link ai negozi.

Nessuna dipendenza: solo HTML, CSS, JavaScript e un piccolo server Python per l'import
dei link prodotto.

---

## Avvio

```bash
python3 server.py
```

Poi apri <http://localhost:8000>.

Per cambiare porta: `python3 server.py 8080` (oppure `./avvia.sh 8080`).

> Aprendo `index.html` con doppio clic funziona tutto **tranne** l'import automatico
> dai link dei negozi, perché serve il server locale.

---

## Cosa puoi fare

- **3 modelli** di partenza con estetica diversa (naked, sport, scrambler); il default è
  la **Benelli Leoncino 250**.
- **5 temi** completi (Corsa, Stealth, Gulf, Neon, Retrò) più l'**Argento** di serie.
- **7 categorie di parti**: scarico, sella, cerchi, parafango, specchietti, cupolino, livrea.
- **Colori su misura** per serbatoio, codino, sella, cerchi, telaio, scarico, dettagli e cupolino.
- **Anteprima live** con confronto "Originale" a un clic.
- **Due modalità di resa**: vettoriale (SVG stilizzato) e **foto** (render fotografico
  della Leoncino 250 con ricoloritura a maschere).
- **Foto personale**: carichi una foto laterale della tua moto e allinei le maschere con
  i cursori di calibrazione.
- **Preventivo** con totale e rimozione rapida delle singole parti.
- **Import da link**: incolli l'URL di un prodotto e l'app legge titolo, immagine e prezzo
  dalla pagina (OpenGraph / JSON-LD), poi lo aggiunge alla moto con il colore scelto.
- **Salvataggio automatico** della configurazione sul dispositivo.
- **Export PNG** dell'anteprima (anche in modalità foto), pronto da condividere.
- Layout responsive desktop / tablet / smartphone.

---

## Come è fatto

```
index.html      struttura e pannelli
styles.css      interfaccia scura "studio"
app.js          dati, SVG della moto, stato, prezzi, import, modalità foto
configurator.js dominio puro (modelli, temi) condiviso con i test
server.py       server statico + /api/preview per i metadati dei prodotti
assets/         render della Leoncino 250 e immagini dei modelli
mobile/         variante di layout per smartphone
design/         mockup e componenti di riferimento
tests/          test Node del dominio e test Python del server
```

La moto è un **SVG a livelli** generato da JavaScript: ogni parte è un gruppo disegnato
in ordine di profondità. I colori sono variabili CSS inserite *dentro* l'SVG, così
l'anteprima si aggiorna all'istante e l'export PNG resta identico a schermo.

Lo stato (modello, tema, parti, colori, parti importate, foto e calibrazione) vive in
`localStorage`. Tutto è lato client: nessun dato lascia il computer, tranne la URL che
chiedi di importare.

### Modalità foto

Il pulsante **Foto / Vettoriale** sopra l'anteprima cambia la resa. In modalità foto la
Leoncino 250 usa il render studio ufficiale (`assets/leoncino-250.png`) e sopra di esso
disegna maschere SVG per serbatoio, codino, sella, scarico, parafango e cerchi. Ogni
maschera viene ricolorata con `mix-blend-mode: color`, più un livello `multiply` per far
prendere il colore anche alle zone chiare. L'export PNG usa la stessa pipeline su canvas.

Con **Carica una tua foto** puoi sostituire il render con una foto laterale della moto;
l'immagine viene normalizzata a 1200×1021 JPEG. Apri **Calibrazione aree** e, zona per
zona, regola posizione, scala, rotazione, sfumatura e opacità finché le maschere non
combaciano con la carrozzeria. Le impostazioni restano salvate nel browser. Con
**Mostra le aree colorate** vedi le maschere a pieno colore per allinearle meglio.

> Il render ufficiale è usato solo come base dimostrativa locale: non ridistribuirlo.
> Fonte: `cdn.keeway.com` (render stampa Benelli Leoncino 250). Per un uso pubblico
> sostituiscilo con una foto tua o con un'immagine di cui hai i diritti.

### Import da negozio

`server.py` espone `GET /api/preview?url=...`, scarica la pagina HTML (max 1,5 MB, timeout 8 s),
estrae `og:title`, `og:image`, `og:site_name`, prezzo da meta tag o JSON-LD e restituisce JSON.
Il server ascolta solo su `127.0.0.1` e blocca richieste verso indirizzi privati/locali.

---

## Personalizzare

Tutto il catalogo è in cima a `app.js`:

- `MODELS` → modelli, prezzo base, stile, colori di serie.
- `THEMES` → palette dei temi.
- `PARTS` → parti, prezzi, varianti visive, link.
- `storeLink()` → oggi punta a ricerche Amazon: **sostituiscilo con i tuoi link affiliati**.

Per aggiungere un modello basta una voce in `MODELS` e, se vuoi un'estetica nuova,
un ramo in `bikeMarkup()`.

---

## Limiti attuali (da sapere prima di investirci)

1. **Il disegno vettoriale è stilizzato, non è una foto.** Serve a esplorare combinazioni,
   non a garantire la resa esatta del pezzo reale.
2. **In modalità foto cambiano i colori, non le forme.** Serbatoio, codino, sella, cerchi,
   parafango e scarico vengono ricolorati sopra il render; per sostituire davvero la forma
   di un pezzo servono foto/livelli dedicati per ogni parte, oppure un modello 3D.
3. **Le foto dei prodotti importati non vengono applicate alla moto**: vengono mostrate
   nella scheda e servono a compilare nome/prezzo/colore.
4. **Compatibilità reale**: anno, versione, attacchi, misure e omologazioni non sono
   verificati. Un prodotto vero deve incrociare questi dati.
5. **Scraping e condizioni d'uso**: molti e-commerce vietano l'estrazione automatica dei
   contenuti. Per un prodotto commerciale conviene usare feed affiliati (Awin, Tradedoubler,
   Amazon PA-API), API ufficiali o un catalogo curato con deep link, rispettando robots.txt
   e i termini del negozio.
6. **Diritti sulle immagini**: il render Benelli incluso è un segnaposto per il prototipo.
   Prima di pubblicare l'app, sostituiscilo con materiale tuo o con licenza adeguata.

---

## Prossimi passi consigliati

1. **Catalogo per il tuo modello specifico** (marca, modello, anno): parti compatibili,
   non un catalogo generico.
2. **Foto reali**: una base fotografica della moto + livelli/maschere per le parti, così
   il risultato è credibile. È il salto di qualità più grande.
3. **3D**: modello glTF/GLB con `<model-viewer>` o Three.js per ruotare la moto e vedere
   i dettagli da ogni lato.
4. **Integrazione negozi**: feed/API + link affiliati, con prezzo e disponibilità aggiornati.
5. **Condivisione**: link/JSON della configurazione, account, confronto tra configurazioni.
6. **AR**: vedere la moto personalizzata nello spazio reale da smartphone.

---

## Nota

Prezzi, prodotti e link sono dimostrativi. Verifica sempre prezzo, misure, omologazione
e compatibilità sul sito del venditore prima di acquistare.
