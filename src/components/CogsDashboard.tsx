import type { CostBreakdown } from '../utils/calculationEngine';
import type { WinePreset } from '../types/wine';
import { exportPresetToCsv } from '../utils/exportUtils';

interface CogsDashboardProps {
  breakdown: CostBreakdown;
  activePreset: WinePreset;
}

export default function CogsDashboard({ breakdown, activePreset }: CogsDashboardProps) {
  const { costoTotaleLotto, costoPerBottiglia, macroPercentuali } = breakdown;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  const mp = macroPercentuali.materiaPrima;
  const conf = macroPercentuali.confezionamento;
  const struct = macroPercentuali.strutturaEProcesso;

  const strokeDashOffsetMp = circumference - (mp / 100) * circumference;
  const strokeDashOffsetConf = circumference - (conf / 100) * circumference;
  const strokeDashOffsetStruct = circumference - (struct / 100) * circumference;

  const rotationMp = -90;
  const rotationConf = rotationMp + (mp / 100) * 360;
  const rotationStruct = rotationConf + (conf / 100) * 360;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-4 space-y-6 print:static print:border-none print:shadow-none print:p-0 print:mb-8">
      <h2 className="text-lg font-bold text-gray-900 border-b pb-2 print:text-2xl">Analisi COGS: {activePreset.nome}</h2>
      
      {/* Indicatori Principali */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 print:bg-white print:border-gray-300">
          <span className="text-xs font-semibold text-red-700 uppercase tracking-wider block print:text-gray-600">Costo / Bottiglia</span>
          <span className="text-2xl font-black text-red-900 print:text-3xl">€ {costoPerBottiglia.toFixed(2)}</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 print:bg-white print:border-gray-300">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider block">Costo Totale Lotto ({activePreset.numeroBottiglie} bt)</span>
          <span className="text-2xl font-bold text-gray-900 print:text-3xl">€ {costoTotaleLotto.toFixed(2)}</span>
        </div>
      </div>

      {/* Grafico Donut SVG Nativo */}
      <div className="flex flex-col items-center justify-center p-4 print:page-break-inside-avoid">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full" viewBox="0 0 140 140">
            {(mp === 0 && conf === 0 && struct === 0) && (
              <circle cx="70" cy="70" r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth="20" />
            )}
            {mp > 0 && (
              <circle
                cx="70" cy="70" r={radius} fill="transparent"
                stroke="#b91c1c" strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashOffsetMp}
                transform={`rotate(${rotationMp} 70 70)`}
              />
            )}
            {conf > 0 && (
              <circle
                cx="70" cy="70" r={radius} fill="transparent"
                stroke="#d97706" strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashOffsetConf}
                transform={`rotate(${rotationConf} 70 70)`}
              />
            )}
            {struct > 0 && (
              <circle
                cx="70" cy="70" r={radius} fill="transparent"
                stroke="#2563eb" strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashOffsetStruct}
                transform={`rotate(${rotationStruct} 70 70)`}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-medium text-gray-500 uppercase">Incidenza</span>
            <span className="text-sm font-bold text-gray-800">COGS</span>
          </div>
        </div>

        {/* Legenda Grafico */}
        <div className="w-full mt-6 space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-700 inline-block"></span>
              <span className="text-gray-600">Materia Prima</span>
            </div>
            <span className="font-semibold text-gray-900">{mp.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-600 inline-block"></span>
              <span className="text-gray-600">Confezionamento</span>
            </div>
            <span className="font-semibold text-gray-900">{conf.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
              <span className="text-gray-600">Processo & Struttura</span>
            </div>
            <span className="font-semibold text-gray-900">{struct.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Pannello Azioni di Esportazione - Nascondi totalmente durante la stampa */}
      <div className="pt-4 border-t border-gray-200 space-y-2 print:hidden">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Esportazione Report</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => exportPresetToCsv(activePreset, breakdown)}
            className="flex items-center justify-center space-x-1 bg-green-700 text-white p-2 rounded-lg font-semibold text-sm hover:bg-green-800 transition-colors min-h-[44px]"
          >
            <span>📊 Eccel / CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center space-x-1 bg-gray-800 text-white p-2 rounded-lg font-semibold text-sm hover:bg-gray-900 transition-colors min-h-[44px]"
          >
            <span>📄 Stampa / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}