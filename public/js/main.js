document.addEventListener('DOMContentLoaded', () => {
    console.log('Script di Customizer Caricato!'); 

    let configData = {};
    let catalogData = {}; // Nuovo oggetto per il catalogo delle parti
    let selectedParts = {}; // Stato per tracciare le parti scelte dall'utente: {sella: 'id_parte_x', scarico: 'id_parte_y'}
    let baseMotoInfo = {}; // Dati della moto base selezionata (prezzo, peso)

    // --- UTILITY: Caricamento Dati JSON (La funzione è la stessa, aggiungiamo il fetch) ---
    async function fetchData(url) {
        // ... (La funzione fetchData rimane invariata) ...
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Errore HTTP! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Errore nel caricamento dei dati:', error);
            return null;
        }
    }
    
    // --- Funzione che Popola i Modelli (AGGIORNATA per salvare baseMotoInfo) ---
    function populateModels() {
        // ... (Logica per popolare i menu Modello/Marca) ...
        const brandSelect = document.getElementById('brand-select');
        const modelSelect = document.getElementById('model-select');
        const selectedBrand = brandSelect.value;
        
        modelSelect.innerHTML = '<option value="">Seleziona Modello...</option>';
        modelSelect.disabled = true;

        if (selectedBrand) {
            const brandData = configData.motori.find(moto => moto.marca === selectedBrand);
            if (brandData) {
                brandData.modelli.forEach(model => {
                    const option = document.createElement('option');
                    option.value = JSON.stringify(model); 
                    option.textContent = `${model.nome} (${model.anno})`;
                    modelSelect.appendChild(option);
                });
                modelSelect.disabled = false;
            }
        }
        
        // Listener per salvare i dati della moto base quando viene selezionata
        modelSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                baseMotoInfo = JSON.parse(e.target.value);
                console.log('Moto Base selezionata:', baseMotoInfo.nome);
                // Qui potresti aggiornare l'immagine base (Fase 4)
            } else {
                baseMotoInfo = {};
            }
        });
    }

    // ... (La funzione populateSelects rimane la stessa) ...
    function populateSelects() {
        // ... (Logica per popolare i menu Tema/Marca) ...
        if (!configData.motori || !configData.temi) return;

        const brandSelect = document.getElementById('brand-select');
        configData.motori.forEach(motoBrand => {
            const option = document.createElement('option');
            option.value = motoBrand.marca;
            option.textContent = motoBrand.marca;
            brandSelect.appendChild(option);
        });

        const themeSelect = document.getElementById('theme-select');
        configData.temi.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.toLowerCase().replace(/\s/g, ''); 
            option.textContent = theme;
            themeSelect.appendChild(option);
        });
        
        brandSelect.addEventListener('change', populateModels);
    }
    // ----------------------------------------------------------------------------------


    // --- NUOVA LOGICA: Ricerca e Visualizzazione Risultati (Fase 3/4) ---

    function searchAndDisplayParts(partType) {
        const themeSelect = document.getElementById('theme-select');
        const selectedTheme = themeSelect.value;
        
        const resultsContainer = document.getElementById('results-display');
        resultsContainer.innerHTML = ''; // Pulisce i risultati precedenti

        // Filtro 1: Trova tutte le parti del tipo richiesto (es. 'sella')
        let results = catalogData.parts_catalog.filter(part => part.part_type === partType);

        // Filtro 2 (Simulazione Ricerca e Tema): Applica il filtro del tema
        if (selectedTheme) {
             results = results.filter(part => part.tema_compatibile.includes(selectedTheme));
        }
        
        const title = document.createElement('h3');
        title.textContent = `Risultati Aggregati per ${partType} (${results.length} trovati)`;
        resultsContainer.appendChild(title);

        if (results.length === 0) {
            resultsContainer.innerHTML += `<p>Nessuna parte trovata per questo tema e tipo.</p>`;
            return;
        }
        
        // Crea le Schede Risultato (Aggregatore)
        results.forEach(part => {
            const card = document.createElement('div');
            card.classList.add('part-card');
            
            // Funzione al click: Seleziona la parte e aggiorna la visualizzazione
            card.addEventListener('click', () => selectPart(part));
            
            // Contenuto della Scheda
            card.innerHTML = `
                <h4>${part.nome}</h4>
                <p>Costo: €${part.costo.toFixed(2)}</p>
                <p>Peso: ${part.peso_variazione}kg</p>
                <a href="${part.url_acquisto}" target="_blank">Acquista su E-commerce (Simulato)</a>
            `;
            
            resultsContainer.appendChild(card);
        });
    }

    function selectPart(part) {
        // 1. Aggiorna lo stato del progetto
        selectedParts[part.part_type] = part;
        console.log(`[SELEZIONE] Nuova parte selezionata: ${part.nome}`);
        
        // 2. Aggiorna la Visualizzazione (Fase 4)
        updateMotoLayer(part);
        
        // 3. Aggiorna il Report Costi (Fase 6 - Prossimo step)
        // updateFinalReport();
    }
    
    function updateMotoLayer(part) {
        // Rimuove tutti i vecchi layer di quel tipo (gestiti dal nuovo ID)
        const partType = part.part_type;
        const oldLayers = document.querySelectorAll(`.part-${partType}`);
        oldLayers.forEach(layer => layer.remove());

        // Crea il nuovo layer con l'immagine della parte selezionata
        const container = document.getElementById('moto-layers-container');
        const newLayer = document.createElement('img');
        
        newLayer.id = part.layer_id; // ID unico, es: layer-sella-bobber-marron
        newLayer.src = part.layer_src; 
        newLayer.alt = part.nome;
        newLayer.classList.add('moto-layer', 'visible', `part-${partType}`);
        
        container.appendChild(newLayer);
    }
    
    // ----------------------------------------------------------------------------------
    // Logica di Avvio e Interazione
    // ----------------------------------------------------------------------------------

    // 1. Carica i Dati
    Promise.all([
        fetchData('public/data/config.json'),
        fetchData('public/data/parts_catalog.json') // Carica il catalogo
    ]).then(([config, catalog]) => {
        configData = config;
        catalogData = catalog;
        
        if (configData) populateSelects();
        
        // 2. Attacca i listener ai pulsanti di selezione (Fase 2)
        const partSelectors = document.querySelectorAll('.part-selector');

        if (partSelectors.length > 0) {
            partSelectors.forEach(button => {
                console.log(`[ATTACCO] Event listener aggiunto al pulsante: ${button.innerText}`);
                
                button.addEventListener('click', () => {
                    const partType = button.getAttribute('data-part'); 
                    console.log(`[CLICK CATTURATO] Avvio ricerca per: ${partType}`); 
                    
                    // Chiama la funzione di ricerca al click sul selettore
                    searchAndDisplayParts(partType);
                });
            });
        }
    });

    function updateFinalReport() {
    const reportContainer = document.getElementById('final-report');
    
    // Controlla se abbiamo selezionato una moto base
    if (!baseMotoInfo || Object.keys(baseMotoInfo).length === 0) {
        reportContainer.innerHTML = '<h4>Seleziona prima un Modello Base per il calcolo!</h4>';
        return;
    }
    
    let totalCostParts = 0;
    let totalWeightChange = 0;
    let partsListHTML = '';
    
    // 1. Calcola Totali e crea lista di acquisto
    for (const partType in selectedParts) {
        const part = selectedParts[partType];
        totalCostParts += part.costo;
        totalWeightChange += part.peso_variazione;
        
        partsListHTML += `
            <li>
                <strong>${part.nome}</strong> (${partType}): €${part.costo.toFixed(2)}
                [<a href="${part.url_acquisto}" target="_blank">Link Acquisto</a>]
            </li>
        `;
    }

    const finalTotalCost = baseMotoInfo.prezzo_base + totalCostParts;
    const finalTotalWeight = baseMotoInfo.peso_base + totalWeightChange;

    // 2. Popola il Report
    reportContainer.innerHTML = `
        <h3>Riepilogo Progetto</h3>
        <p><strong>Moto Base:</strong> ${baseMotoInfo.nome} (${baseMotoInfo.anno})</p>
        <p><strong>Costo Base:</strong> €${baseMotoInfo.prezzo_base.toFixed(2)}</p>
        <hr>
        
        <h4>Parti Custom Selezionate:</h4>
        <ul style="list-style-type: disc; padding-left: 20px;">
            ${partsListHTML || '<li>Nessuna parte custom selezionata.</li>'}
        </ul>
        
        <hr>
        
        <h3>💰 Totale Finanziario</h3>
        <p style="font-size: 1.1em;">
            <strong>Costo Totale Progetto:</strong> 
            <span style="color: green; font-weight: bold;">€${finalTotalCost.toFixed(2)}</span>
        </p>
        
        <h3>⚖️ Variazione di Peso</h3>
        <p>
            Peso Originale: ${baseMotoInfo.peso_base} kg<br>
            Variazione Custom: ${totalWeightChange > 0 ? '+' : ''}${totalWeightChange.toFixed(1)} kg<br>
            <strong>Peso Finale Stimato:</strong> ${finalTotalWeight.toFixed(1)} kg
        </p>
    `;
}

// Bisogna chiamare la funzione di aggiornamento del report ogni volta che una parte viene selezionata.

// Modifica la funzione selectPart in questo modo (aggiungendo la riga finale):
function selectPart(part) {
    // 1. Aggiorna lo stato del progetto
    selectedParts[part.part_type] = part;
    console.log(`[SELEZIONE] Nuova parte selezionata: ${part.nome}`);
    
    // 2. Aggiorna la Visualizzazione (Fase 4)
    updateMotoLayer(part);
    
    // 3. AGGIUNGI QUESTA RIGA: Aggiorna il Report Costi (Fase 6)
    updateFinalReport(); 
}

// Chiama updateFinalReport all'avvio per mostrare il messaggio di selezione
updateFinalReport();
});