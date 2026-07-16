import type { WinePreset } from '../types/wine';

export interface CostBreakdown {
  costoTotaleLotto: number;
  costoPerBottiglia: number;
  // Dettaglio dei costi espressi PER SINGOLA BOTTIGLIA
  dettaglioPerBottiglia: {
    materiaPrima: number;
    tappo: number;
    capsula: number;
    etichetta: number;
    cartone: number;
    manoDopera: number;
    utenze: number;
    vinificazione: number;
    imbottigliamento: number;
    vetro: number;       // [NEW]
    trasporto: number;   // [NEW]
  };
  // Raggruppamento macro per il grafico Donut (%)
  macroPercentuali: {
    materiaPrima: number;
    confezionamento: number; // Tappo + Capsula + Etichetta + Cartone + Imbottigliamento + Vetro [NEW]
    strutturaEProcesso: number; // Vinificazione + Utenze + Mano d'opera + Trasporto [NEW]
  };
  // Analisi Commerciale (Pricing) [NEW]
  pricing: {
    prezzoVenditaTarget: number;    // COGS + Margine % (Markup)
    prezzoNetto: number;            // Prezzo Target - Provvigione/Sconto %
    margineEffettivoEuro: number;   // Prezzo Netto - COGS unitario
    ricavoTotaleLotto: number;      // Prezzo Netto * Numero Bottiglie
    profittoTotaleLotto: number;    // Margine Effettivo Unitario * Numero Bottiglie
  };
}

const VOLUME_BOTTIGLIA = 0.75; // Volume standard in litri (750ml)

export const calculateCogs = (preset: WinePreset): CostBreakdown => {
  const { materiaPrima, costiFissiEVariabili, numeroBottiglie, marginePercentuale, provvigionePercentuale } = preset;
  const nBottiglie = Math.max(1, numeroBottiglie); // Previene divisioni per zero

  // 1. Calcolo del costo della Materia Prima per Litro di Vino
  let costoMateriaPrimaPerLitro = 0;
  if (materiaPrima.tipo === 'VINO') {
    costoMateriaPrimaPerLitro = materiaPrima.costoUnitario;
  } else {
    // Modalità UVA: input in €/100g (ovvero €/hg). 
    // €/kg = costoUnitario * 10.
    // Se la resa è 70%, 100kg di uva producono 70L di vino.
    // Formula: (costo al kg * 100) / resaPercentuale
    const resa = materiaPrima.resaPercentuale || 70;
    const costoAlKg = materiaPrima.costoUnitario * 10;
    costoMateriaPrimaPerLitro = (costoAlKg * 100) / resa;
  }

  // Costo materia prima per singola bottiglia (0.75L)
  const mpPerBottiglia = costoMateriaPrimaPerLitro * VOLUME_BOTTIGLIA;

  // 2. Costi di Processo/Litro (es. Vinificazione) elevati a livello bottiglia
  const vinificazionePerBottiglia = costiFissiEVariabili.vinificazione * VOLUME_BOTTIGLIA;

  // 3. Costi Fissi del Lotto (Utenze e Mano d'opera totali) ripartiti per bottiglia
  const utenzePerBottiglia = (costiFissiEVariabili.utenze || 0) / nBottiglie;
  const manoDoperaPerBottiglia = (costiFissiEVariabili.manoDopera || 0) / nBottiglie;

  // 4. Costi Diretti per Unità (già a livello bottiglia)
  const { 
    tappo = 0, 
    capsula = 0, 
    etichetta = 0, 
    cartone = 0, 
    imbottigliamento = 0,
    vetro = 0,
    trasporto = 0
  } = costiFissiEVariabili;

  // Costo Industriale Totale per singola bottiglia (COGS)
  const costoPerBottiglia = 
    mpPerBottiglia +
    tappo +
    capsula +
    etichetta +
    cartone +
    manoDoperaPerBottiglia +
    utenzePerBottiglia +
    vinificazionePerBottiglia +
    imbottigliamento +
    vetro +
    trasporto;

  const costoTotaleLotto = costoPerBottiglia * nBottiglie;

  // Scomposizione Macro per il grafico ad anello
  // Il vetro si somma al confezionamento, il trasporto alla struttura e processo logistico.
  const confezionamentoTotale = tappo + capsula + etichetta + cartone + imbottigliamento + vetro;
  const strutturaEProcessoTotale = vinificazionePerBottiglia + utenzePerBottiglia + manoDoperaPerBottiglia + trasporto;
  
  const sommaCosti = mpPerBottiglia + confezionamentoTotale + strutturaEProcessoTotale;
  
  const macroPercentuali = {
    materiaPrima: sommaCosti > 0 ? (mpPerBottiglia / sommaCosti) * 100 : 0,
    confezionamento: sommaCosti > 0 ? (confezionamentoTotale / sommaCosti) * 100 : 0,
    strutturaEProcesso: sommaCosti > 0 ? (strutturaEProcessoTotale / sommaCosti) * 100 : 0,
  };

  // 5. Calcoli di Pricing Commerciale
  const marg = marginePercentuale || 0;
  const prov = provvigionePercentuale || 0;

  // Prezzo target: costo industriale incrementato del margine utile (Markup)
  const prezzoVenditaTarget = costoPerBottiglia * (1 + marg / 100);

  // Prezzo netto: prezzo target ridotto dello sconto commerciale o provvigione agente
  const prezzoNetto = prezzoVenditaTarget * (1 - prov / 100);

  // Margine utile effettivo in euro per singola bottiglia
  const margineEffettivoEuro = prezzoNetto - costoPerBottiglia;

  // Totali sul lotto complessivo
  const ricavoTotaleLotto = prezzoNetto * nBottiglie;
  const profittoTotaleLotto = margineEffettivoEuro * nBottiglie;

  return {
    costoTotaleLotto,
    costoPerBottiglia,
    dettaglioPerBottiglia: {
      materiaPrima: mpPerBottiglia,
      tappo,
      capsula,
      etichetta,
      cartone,
      manoDopera: manoDoperaPerBottiglia,
      utenze: utenzePerBottiglia,
      vinificazione: vinificazionePerBottiglia,
      imbottigliamento,
      vetro,
      trasporto
    },
    macroPercentuali,
    pricing: {
      prezzoVenditaTarget,
      prezzoNetto,
      margineEffettivoEuro,
      ricavoTotaleLotto,
      profittoTotaleLotto
    }
  };
};