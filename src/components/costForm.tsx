import type { WinePreset, CostiConfig } from '../types/wine';

interface CostFormProps {
  preset: WinePreset;
  onUpdate: (fields: Partial<WinePreset>) => void;
}

export default function CostForm({ preset, onUpdate }: CostFormProps) {
  const { materiaPrima, costiFissiEVariabili, numeroBottiglie, nome } = preset;

  const handleMateriaPrimaChange = (key: string, value: any) => {
    onUpdate({
      materiaPrima: {
        ...materiaPrima,
        [key]: value,
      },
    });
  };

  const handleCostiChange = (key: keyof CostiConfig, value: number) => {
    onUpdate({
      costiFissiEVariabili: {
        ...costiFissiEVariabili,
        [key]: value,
      },
    });
  };

  // Helper per generare una classe di stile uniforme e touch-friendly per gli input
  const inputClass = "w-full min-h-[44px] p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-base";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1";

  return (
    <div className="space-y-6 bg-gray-50 p-4 rounded-xl border border-gray-200 print:bg-white print:border-none print:p-0">
      {/* Informazioni Base */}
      <div>
        <label className={labelClass}>Nome Vino / Lotto</label>
        <input
          type="text"
          value={nome}
          placeholder="Es. Aglianico DOCG 2024"
          className={inputClass}
          onChange={(e) => onUpdate({ nome: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 print:break-inside-avoid">
        <div>
          <label className={labelClass}>Numero Bottiglie</label>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            value={numeroBottiglie}
            className={inputClass}
            onChange={(e) => onUpdate({ numeroBottiglie: Math.max(1, parseInt(e.target.value) || 0) })}
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Sezione Materia Prima */}
      <div>
        <label className={labelClass}>Tipo Materia Prima</label>
        <div className="flex bg-gray-200 p-1 rounded-lg">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${materiaPrima.tipo === 'UVA' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-600'}`}
            onClick={() => handleMateriaPrimaChange('tipo', 'UVA')}
          >
            Uva (€/100g)
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${materiaPrima.tipo === 'VINO' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-600'}`}
            onClick={() => handleMateriaPrimaChange('tipo', 'VINO')}
          >
            Vino Sfuso (€/L)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 print:break-inside-avoid">
        <div>
          <label className={labelClass}>
            {materiaPrima.tipo === 'UVA' ? 'Costo Uva (€/100g)' : 'Costo Vino (€/L)'}
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="any"
            value={materiaPrima.costoUnitario || ''}
            placeholder="0.00"
            className={inputClass}
            onChange={(e) => handleMateriaPrimaChange('costoUnitario', parseFloat(e.target.value) || 0)}
          />
        </div>

        {materiaPrima.tipo === 'UVA' && (
          <div>
            <label className={labelClass}>Resa Uva/Vino (%)</label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="100"
              value={materiaPrima.resaPercentuale || ''}
              placeholder="70"
              className={inputClass}
              onChange={(e) => handleMateriaPrimaChange('resaPercentuale', parseFloat(e.target.value) || 70)}
            />
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Sezione Confezionamento e Processo */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Costi Materiali e Confezionamento</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tappo (€/cad)</label>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={costiFissiEVariabili.tappo || ''}
              placeholder="0.00"
              className={inputClass}
              onChange={(e) => handleCostiChange('tappo', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className={labelClass}>Capsula (€/cad)</label>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={costiFissiEVariabili.capsula || ''}
              placeholder="0.00"
              className={inputClass}
              onChange={(e) => handleCostiChange('capsula', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className={labelClass}>Etichetta (€/cad)</label>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={costiFissiEVariabili.etichetta || ''}
              placeholder="0.00"
              className={inputClass}
              onChange={(e) => handleCostiChange('etichetta', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className={labelClass}>Cartone (€/bottiglia)</label>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={costiFissiEVariabili.cartone || ''}
              placeholder="Es. Costo Scatola / 6"
              className={inputClass}
              onChange={(e) => handleCostiChange('cartone', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Imbottigliamento (€/bottiglia)</label>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={costiFissiEVariabili.imbottigliamento || ''}
              placeholder="Quota servizio/linea mobile"
              className={inputClass}
              onChange={(e) => handleCostiChange('imbottigliamento', parseFloat(e.target.value) || 0)}
            />
        </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Sezione Struttura, Utenze e Lavoro */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Processo e Quote Allocate (Lotto)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>Vinificazione (€/L di vino nel lotto)</label>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={costiFissiEVariabili.vinificazione || ''}
              placeholder="Costo energia/trattamenti al litro"
              className={inputClass}
              onChange={(e) => handleCostiChange('vinificazione', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className={labelClass}>Utenze Allocate (€ fisso)</label>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={costiFissiEVariabili.utenze || ''}
              placeholder="Quota acqua/energia lotto"
              className={inputClass}
              onChange={(e) => handleCostiChange('utenze', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className={labelClass}>Mano d'opera (€ totale)</label>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={costiFissiEVariabili.manoDopera || ''}
              placeholder="Ore totali × tariffa oraria"
              className={inputClass}
              onChange={(e) => handleCostiChange('manoDopera', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}