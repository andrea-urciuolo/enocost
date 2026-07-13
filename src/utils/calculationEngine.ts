import type { WinePreset } from '../types/wine';

export interface CostBreakdown {
  costoTotaleLotto: number;
  costoPerBottiglia: number;
  // Dettaglio dei costi espressi PER SINGOLA BOTTIGLIA (utile per grafici e UI)
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
  };
  // Raggruppamento macro per il grafico Donut (%)
  macroPercentuali: {
    materiaPrima: number;
    confezionamento: number; // Tappo + Capsula + Etichetta + Cartone + Imbottigliamento
    strutturaEProcesso: number; // Vinificazione + Utenze + Mano d'opera
  };
}

const VOLUME_BOTTIGLIA = 0.75; // Volume standard in litri (750ml)

export const calculateCogs = (preset: WinePreset): CostBreakdown => {
  const { materiaPrima, costiFissiEVariabili, numeroBottiglie } = preset;
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
  const utenzePerBottiglia = costiFissiEVariabili.utenze / nBottiglie;
  const manoDoperaPerBottiglia = costiFissiEVariabili.manoDopera / nBottiglie;

  // 4. Costi Diretti per Unità (già a livello bottiglia)
  const { tappo, capsula, etichetta, cartone, imbottigliamento } = costiFissiEVariabili;

  // Costo Totale per singola bottiglia
  const costoPerBottiglia = 
    mpPerBottiglia +
    tappo +
    capsula +
    etichetta +
    cartone +
    manoDoperaPerBottiglia +
    utenzePerBottiglia +
    vinificazionePerBottiglia +
    imbottigliamento;

  const costoTotaleLotto = costoPerBottiglia * nBottiglie;

  // Scomposizione Macro per il grafico ad anello
  const confezionamentoTotale = tappo + capsula + etichetta + cartone + imbottigliamento;
  const strutturaEProcessoTotale = vinificazionePerBottiglia + utenzePerBottiglia + manoDoperaPerBottiglia;
  
  const sommaCosti = mpPerBottiglia + confezionamentoTotale + strutturaEProcessoTotale;
  
  const macroPercentuali = {
    materiaPrima: sommaCosti > 0 ? (mpPerBottiglia / sommaCosti) * 100 : 0,
    confezionamento: sommaCosti > 0 ? (confezionamentoTotale / sommaCosti) * 100 : 0,
    strutturaEProcesso: sommaCosti > 0 ? (strutturaEProcessoTotale / sommaCosti) * 100 : 0,
  };

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
      imbottigliamento
    },
    macroPercentuali
  };
};