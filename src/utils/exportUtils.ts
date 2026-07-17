import type { WinePreset } from '../types/wine';
import type { CostBreakdown } from './calculationEngine';

export const exportPresetToCsv = (preset: WinePreset, breakdown: CostBreakdown) => {
  const { dettaglioPerBottiglia, macroPercentuali, pricing } = breakdown;

  // Struttura delle righe del report Excel/CSV
  const rows = [
    ['REPORT FINANZIARIO E COGS INDUSTRIALE - ENOCOST'],
    ['Nome Vino / Lotto', preset.nome],
    ['Data Report', new Date().toLocaleDateString('it-IT')],
    ['Numero Bottiglie Lotto', preset.numeroBottiglie.toString()],
    [],
    ['ANALISI COGS INDUSTRIALE PER VOCE'],
    ['VOCE DI COSTO', 'COSTO UNITARIO (€/Bottiglia)', 'INCIDENZA SUL TOTALE (%)'],
    ['Materia Prima (Uva/Vino)', dettaglioPerBottiglia.materiaPrima.toFixed(4), macroPercentuali.materiaPrima.toFixed(2)],
    ['Bottiglia di Vetro', dettaglioPerBottiglia.vetro.toFixed(4), ((dettaglioPerBottiglia.vetro / breakdown.costoPerBottiglia) * 100).toFixed(2)],
    ['Tappo', dettaglioPerBottiglia.tappo.toFixed(4), ((dettaglioPerBottiglia.tappo / breakdown.costoPerBottiglia) * 100).toFixed(2)],
    ['Capsula', dettaglioPerBottiglia.capsula.toFixed(4), ((dettaglioPerBottiglia.capsula / breakdown.costoPerBottiglia) * 100).toFixed(2)],
    ['Etichetta', dettaglioPerBottiglia.etichetta.toFixed(4), ((dettaglioPerBottiglia.etichetta / breakdown.costoPerBottiglia) * 100).toFixed(2)],
    ['Cartone', dettaglioPerBottiglia.cartone.toFixed(4), ((dettaglioPerBottiglia.cartone / breakdown.costoPerBottiglia) * 100).toFixed(2)],
    ['Imbottigliamento', dettaglioPerBottiglia.imbottigliamento.toFixed(4), ((dettaglioPerBottiglia.imbottigliamento / breakdown.costoPerBottiglia) * 100).toFixed(2)],
    ['Vinificazione', dettaglioPerBottiglia.vinificazione.toFixed(4), ((dettaglioPerBottiglia.vinificazione / breakdown.costoPerBottiglia) * 100).toFixed(2)],
    ['Utenze Allocate', dettaglioPerBottiglia.utenze.toFixed(4), ((dettaglioPerBottiglia.utenze / breakdown.costoPerBottiglia) * 100).toFixed(2)],
    ['Mano d\'opera', dettaglioPerBottiglia.manoDopera.toFixed(4), ((dettaglioPerBottiglia.manoDopera / breakdown.costoPerBottiglia) * 100).toFixed(2)],
    ['Trasporto e Logistica', dettaglioPerBottiglia.trasporto.toFixed(4), ((dettaglioPerBottiglia.trasporto / breakdown.costoPerBottiglia) * 100).toFixed(2)],
    [],
    ['SINTESI INDUSTRIALE'],
    ['COSTO INDUSTRIALE PER BOTTIGLIA (COGS)', `EUR ${breakdown.costoPerBottiglia.toFixed(4)}`],
    ['COSTO TOTALE DEL LOTTO', `EUR ${breakdown.costoTotaleLotto.toFixed(4)}`],
    [],
    ['POLITICHE COMMERCIALI E PRICING'],
    ['Margine Utile di Ricarica (Markup)', `${preset.marginePercentuale}%`],
    ['PREZZO DI VENDITA TARGET', `EUR ${pricing.prezzoVenditaTarget.toFixed(4)}`],
    ['Provvigioni Agenti / Sconto applicato', `${preset.provvigionePercentuale}%`],
    ['PREZZO NETTO RICAVATO', `EUR ${pricing.prezzoNetto.toFixed(4)}`],
    ['MARGINE NETTO REALE (€/Bottiglia)', `EUR ${pricing.margineEffettivoEuro.toFixed(4)}`],
    ['RICAVO NETTO TOTALE LOTTO', `EUR ${pricing.ricavoTotaleLotto.toFixed(4)}`],
    ['PROFITTO NETTO TOTALE LOTTO', `EUR ${pricing.profittoTotaleLotto.toFixed(4)}`]
  ];

  // Trasformazione in formato CSV leggibile da Excel (usando il punto e virgola come separatore standard europeo)
  const csvContent = "\uFEFF" + rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(";")).join("\n");
  
  // Creazione del file temporaneo per il download del client
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", `EnoCost_Report_${preset.nome.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};