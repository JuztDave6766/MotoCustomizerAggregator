# MotoLab — configuratore visivo per la tua moto

Prototipo funzionante di un configuratore web: scegli il modello, applichi un tema,
monti scarico, sella, cerchi, parafango, specchietti, manubrio, cupolino, livrea e borse,
e vedi la moto aggiornarsi in tempo reale con il preventivo e i link ai negozi.

L'MVP è centrato sulla **Benelli Leoncino 250** e su un **catalogo di prodotti reali**.
La resa principale è il **collage**: le foto dei prodotti vengono scontornate lungo il
loro contorno e appoggiate sulla moto come ritagli di rivista, con etichette di carta,
nastro adesivo e linee che puntano al punto giusto. Niente schede bianche attorno ai
prodotti: resta solo l'oggetto ritagliato.

Nessuna dipendenza: solo HTML, CSS, JavaScript e un piccolo server Python per l'import
dei link e il proxy delle immagini.

---

## Avvio

```bash
python3 server.py
```

Poi apri <http://localhost:8000>.

Per cambiare porta: `python3 server.py 8080` (oppure `./avvia.sh 8080`).

> Aprendo `index.html` con doppio clic funzionano vettoriale, foto e collage, ma **non**
> l'import automatico né le immagini dei prodotti dai negozi: entrambi passano dal server
> locale (`/api/preview` e `/api/image`).

---

## Cosa puoi fare

- **4 modelli** di partenza con estetica diversa (naked, sport, scrambler); il default è
  la **Benelli Leoncino 250**.
- **5 temi** completi (Corsa, Stealth, Gulf, Neon, Retrò) più l'**Argento** di serie.
- **9 categorie di parti**: scarico, sella, cerchi, parafango, specchietti, manubrio,
  cupolino, livrea, borse.
- **Colori su misura** per serbatoio, codino, sella, cerchi, telaio, scarico, dettagli e cupolino.
- **Anteprima live** con confronto "Originale" a un clic.
- **Tre modalità di resa**: vettoriale (SVG stilizzato), **foto** (render della Leoncino
  250 con ricoloritura a maschere) e **collage** (moodboard con i prodotti reali).
- **Catalogo reale** per la Leoncino 250: prodotti verificati, prezzi, link al negozio e
  immagini. Le categorie senza aftermarket verificato mostrano solo la parte di serie;
  i prodotti universali sono segnalati come tali, con le misure da verificare.
- **Foto personale**: carichi una foto laterale della tua moto e allinei le maschere con
  i cursori di calibrazione.
- **Preventivo** con totale e rimozione rapida delle singole parti.
- **Import da link**: incolli l'URL di un prodotto e l'app legge titolo, immagine e prezzo
  dalla pagina (OpenGraph / JSON-LD), poi lo aggiunge alla moto con il colore scelto.
- **Salvataggio automatico** della configurazione sul dispositivo.
- **Export PNG** dell'anteprima, anche in modalità foto e collage.
- Layout responsive desktop / tablet / smartphone.

---

## Come è fatto

```
index.html      struttura e pannelli
styles.css      interfaccia scura "studio" + banco collage
app.js          dati, catalogo, SVG della moto, stato, prezzi, import, collage
configurator.js dominio puro (modelli, temi) condiviso con i test
server.py       server statico + /api/preview + /api/image
assets/         render della Leoncino 250 e immagini dei modelli
mobile/         variante di layout per smartphone
design/         mockup e componenti di riferimento
tests/          test Node del dominio e test Python del server
```

La moto è un **SVG a livelli** generato da JavaScript: ogni parte è un gruppo disegnato
in ordine di profondità. I colori sono variabili CSS inserite *dentro* l'SVG, così
l'anteprima si aggiorna all'istante e l'export PNG resta identico a schermo.

Lo stato (modello, tema, parti, colori, parti importate, foto, calibrazione e posizione dei
ritagli) vive in `localStorage` sotto la chiave `motolab.state.v2`. Tutto è lato client:
nessun dato lascia il computer, tranne la URL che chiedi di importare.

### Modalità foto

Il selettore **Foto / Vettoriale / Collage** sopra l'anteprima cambia la resa. In modalità
foto la Leoncino 250 usa il render studio (`assets/leoncino-250.png`) e sopra di esso
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

### Modalità collage

Scegli una parte dal catalogo e apri **Collage**: la foto del prodotto viene scontornata
lungo il contorno e appoggiata sul render senza cornice, con un'etichetta di carta
(categoria, nome, prezzo) e nastro adesivo. L'app rimuove lo sfondo bianco collegato ai
bordi dell'immagine e ritaglia il rettangolo del prodotto; il risultato è un PNG
trasparente, non una scheda. Una linea tratteggiata collega ogni ritaglio al punto
corrispondente sulla moto.

- **Trascina** un ritaglio per spostarlo.
- Selezionalo e usa i pulsanti **− / + / ⟲ / ⟳** per scalarlo e ruotarlo, oppure i cursori
  nel pannello **Banco collage**.
- Con il ritaglio selezionato puoi anche usare le **frecce** della tastiera (con `Shift`
  si sposta di 5).
- **Mostra le linee guida** accende/spegne i collegamenti.
- **Ripristina ritagli** riporta tutto alla posizione iniziale.

La posizione dei ritagli e la scelta delle linee vengono salvate in `localStorage`. Anche
l'export PNG ricostruisce il banco completo: ritagli trasparenti, ombre, etichette di
carta, nastro e linee guida.

Il collage è un **moodboard**, non una simulazione di montaggio: proporzioni, forme e
compatibilità del prodotto vanno verificate sul sito del venditore.

### Catalogo reale

Il catalogo della Leoncino 250 è in cima ad `app.js` nella costante `CATALOG`. Contiene
solo prodotti verificati sui negozi:

| Categoria | Prodotto | Prezzo | Negozio |
| --- | --- | --- | --- |
| Scarico | MSR Quadstreet Two-Tone | € 333,84 | MSR Distributore Europe |
| Scarico | Craftride Forte cromo (universale) | € 71,99 | Motea |
| Sella | Craftride Flat café racer (universale) | € 67,99 | Motea |
| Cupolino | Puig Custom II 0336H | € 96,99 | MotociclistaOnline.it |
| Cupolino | Puig Touring 0856W | € 128,99 | MotociclistaOnline.it |
| Cupolino | Barracuda Aerosport BL5300 | € 149,90 | MotociclistaOnline.it |
| Parafango | Parafango posteriore Motor-X | € 131,99 | Motor-X |
| Parafango | Estensione parafango Zaddox | € 41,99 | Motea |
| Parafango | Portatarga Barracuda BL5104-SN | € 64,90 | MotociclistaOnline.it |
| Specchietti | Barracuda Skin-X Bar End | € 169,00 | MotociclistaOnline.it |
| Specchietti | Barracuda Skin-R Bar End | € 149,00 | MotociclistaOnline.it |
| Specchietti | Zaddox SP1 Bar End | € 91,99 | Motea |
| Manubrio | Zaddox Clip-On 41 mm | € 55,99 | Motea |
| Manubrio | Barracuda Racing 22 | € 54,90 | Barracuda Moto |
| Borse | Craftride Elgin 2,4 L | € 47,99 | Motea |

Dettagli da verificare prima dell'acquisto:

- **Craftride Forte**: universale, 43 cm × Ø 8 cm, senza EG-BE/TÜV; controllare il
  raccordo al collettore della Leoncino 250.
- **Craftride Flat**: universale 53×25×8,5 cm; richiede adattamenti al telaio.
- **Zaddox Clip-On**: per forcella da 41 mm, barra 22 mm; verificare il diametro reale
  degli steli e lo spazio per i cablaggi.
- **Barracuda Racing 22**: manubrio universale Ø 22 mm; verificare ingombri e lunghezza.
- **Zaddox SP1**: bar-end per manubri 22–25 mm, coppia omologata ECE, specchio Ø 10 cm.
- **Craftride Elgin**: borsa universale 25 cm × Ø 11 cm, cinghie incluse.

Cerchi e livrea non hanno un aftermarket verificato: l'app lo dice esplicitamente e lascia
la parte di serie. Non viene inventato nessun prodotto. **LeoVince non è in catalogo**:
il catalogo ufficiale non riporta applicazioni per la Leoncino 250 (solo 500 e 800).

Prezzi e disponibilità cambiano: ogni scheda apre il negozio, che resta la fonte da
controllare prima dell'acquisto.

### Import da negozio e proxy immagini

`server.py` espone due endpoint:

- `GET /api/preview?url=...`: scarica la pagina HTML (max 1,5 MB, timeout 8 s), estrae
  `og:title`, `og:image`, `og:site_name`, prezzo da meta tag o JSON-LD e restituisce JSON.
- `GET /api/image?url=...`: scarica un'immagine pubblica (max 8 MB, timeout 8 s), verifica
  che il `Content-Type` sia `image/*` e la restituisce same-origin. Serve perché il canvas
  dell'export PNG non può leggere immagini cross-origin senza CORS.

Entrambi accettano solo `http`/`https` e bloccano host privati/locali (SSRF di base). Il
server ascolta solo su `127.0.0.1`.

Alcuni negozi (per esempio Amazon) bloccano le letture automatiche o richiedono JavaScript:
in quel caso l'import mostra i dati manuali da compilare. Il catalogo curato non dipende
dall'import.

---

## Personalizzare

Tutto il catalogo è in cima a `app.js`:

- `MODELS` → modelli, prezzo base, stile, colori di serie.
- `THEMES` → palette dei temi.
- `PARTS` → parti dimostrative e fallback per i modelli senza catalogo reale.
- `CATALOG` → prodotti reali per modello, con `name`, `price`, `meta`, `url`, `site` e
  `image`. Per aggiungere un prodotto basta una voce nella categoria giusta.
- `COLLAGE_ANCHORS` → punto della foto (coordinate 705×600) a cui punta la linea.
- `COLLAGE_DEFAULT` → posizione, scala e rotazione iniziali dei ritagli.

Per aggiungere un modello basta una voce in `MODELS`; per il collage serve anche una foto
in `PHOTO` e le relative ancore.

---

## Limiti attuali (da sapere prima di investirci)

1. **Il disegno vettoriale è stilizzato, non è una foto.** Serve a esplorare combinazioni,
   non a garantire la resa esatta del pezzo reale.
2. **In modalità foto cambiano i colori, non le forme.** Serbatoio, codino, sella, cerchi,
   parafango e scarico vengono ricolorati sopra il render; per sostituire davvero la forma
   di un pezzo servono foto/livelli dedicati per ogni parte, oppure un modello 3D.
3. **Il collage non è un montaggio tecnico.** I ritagli sono immagini di catalogo incollate
   sulla moto: non rispettano prospettiva, scala reale o punti di attacco.
4. **Compatibilità reale**: anno, versione, attacchi, misure e omologazioni non sono
   verificati dall'app. Un prodotto vero deve incrociare questi dati sul sito del venditore.
5. **Copertura del catalogo**: solo le categorie con prodotti verificati hanno alternative.
   Cerchi e livrea restano di serie finché non vengono trovati prodotti affidabili; sella,
   scarico, manubrio e borse includono modelli universali da adattare.
6. **Scraping e condizioni d'uso**: molti e-commerce vietano l'estrazione automatica dei
   contenuti. Per un prodotto commerciale conviene usare feed affiliati (Awin, Tradedoubler,
   Amazon PA-API), API ufficiali o un catalogo curato con deep link, rispettando robots.txt
   e i termini del negozio.
7. **Diritti sulle immagini**: le foto dei prodotti appartengono ai rispettivi negozi e
   produttori. Sono usate qui come ritagli dimostrativi: prima di pubblicare l'app chiedi
   autorizzazione o sostituiscile con materiale tuo o con licenza adeguata. Anche il render
   Benelli incluso è un segnaposto locale, non ridistribuibile.
8. **L'import non funziona su tutti i negozi**: pagine protette o generate via JavaScript
   richiedono inserimento manuale (o API ufficiali).

---

## Prossimi passi consigliati

1. **Ampliare il catalogo verificato** per la Leoncino 250 (cerchi, livrea) e
   aggiungere altri modelli con lo stesso schema `CATALOG`.
2. **Migliorare il collage**: più controlli di ritaglio, didascalie modificabili e
   possibilità di esportare anche un elenco testuale della configurazione.
3. **Feed affiliati** con prezzo e disponibilità aggiornati, al posto del catalogo statico.
4. **3D**: modello glTF/GLB con `<model-viewer>` o Three.js per ruotare la moto e vedere
   i dettagli da ogni lato.
5. **Condivisione**: link/JSON della configurazione, account, confronto tra configurazioni.
6. **AR**: vedere la moto personalizzata nello spazio reale da smartphone.

---

## Nota

Prezzi, prodotti e link sono reali al momento della verifica ma possono cambiare. Verifica
sempre prezzo, misure, omologazione e compatibilità sul sito del venditore prima di
acquistare. Le immagini dei prodotti restano di proprietà dei rispettivi titolari.
