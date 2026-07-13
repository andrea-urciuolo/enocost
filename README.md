# EnoCost — Controllo di Gestione Vitivinicolo (COGS)

EnoCost è una Progressive Web App (PWA) progettata specificamente per le aziende vitivinicole e le cantine. Consente di calcolare in tempo reale il **COGS Industriale (Cost of Goods Sold)** per bottiglia e per lotto, disaccoppiando l'analisi tra materie prime (uva/sfuso), confezionamento e costi di processo/struttura allocati.

L'applicazione è progettata con un approccio **Offline-First**, garantendo il pieno funzionamento in cantina anche in totale assenza di segnale internet.

---

## Funzionalità Principali

*   **Calcolo COGS in Tempo Reale:** Algoritmo enologico integrato che calcola le rese uva/vino, l'impatto dei materiali secchi e l'allocazione delle quote fisse/orarie di manodopera e utenze.
*   **Gestione Multi-Preset:** Possibilità di salvare, aggiornare ed eliminare i profili di costo di diversi vini o lotti direttamente sul dispositivo (tramite `localStorage`).
*   **Esportazione Excel/CSV:** Generazione immediata di report tabellari puliti con separatori standard europei (`;`), pronti per il controllo di gestione o per il commercialista.
*   **Reportistica PDF Nativa:** Layout ottimizzato per la stampa A4 (grazie alle direttive `print:` di Tailwind CSS) che esclude i menu e genera una scheda tecnica pulita con grafici d'incidenza SVG.
*   **PWA Installabile:** Installazione nativa su smartphone Android (Chrome) e iOS (Safari) per un'esperienza a schermo intero senza barre del browser.

---

## Stack Tecnologico

*   **Framework:** React 18 con TypeScript (per la massima robustezza del codice)
*   **Build Tool:** Vite (Ultra-veloce e leggero)
*   **State Management:** Zustand (Persistenza automatica dello stato locale)
*   **Stile & Layout:** Tailwind CSS (Interfaccia responsive e ottimizzazione di stampa)
*   **PWA Engine:** `@vite-pwa/plugin` con Service Worker personalizzato

---
