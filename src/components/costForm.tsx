import { useState, useEffect } from 'react';
import type { WinePreset, CostiConfig } from '../types/wine';

interface CostFormProps {
  preset: WinePreset;
  onUpdate: (fields: Partial<WinePreset>) => void;
}

// ==========================================
// COMPONENTE WRAPPER PER INPUT DECIMALI PRECISI
// Solvale il problema del reset di React quando si scrive "0.00..."
// ==========================================
interface DecimalInputProps {
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  className?: string;
  label: string;
}

function DecimalInput({ value, onChange, placeholder, className, label }: DecimalInputProps) {
  // Tracciamo il valore come stringa locale per evitare che React tronchi i decimali in digitazione
  const [inputValue, setInputValue] = useState<string>(value === 0 ? '' : value.toString());

  // Sincronizza lo stato locale se il valore esterno cambia (es. cambio preset)
  useEffect(() => {
    const parsedLocal = parseFloat(inputValue) || 0;
    if (value !== parsedLocal) {
      setInputValue(value === 0 ? '' : value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sostituiamo la virgola italiana con il punto decimale standard
    let text = e.target.value.replace(',', '.');

    // Regex: Consenti solo numeri e un singolo punto decimale
    if (text === '' || /^[0-9]*\.?[0-9]*$/.test(text)) {
      setInputValue(text);
      
      const parsed = parseFloat(text);
      // Comunica il valore numerico reale al parent (0 se non valido o vuoto)
      onChange(isNaN(parsed) ? 0 : parsed);
    }
  };

  const handleBlur = () => {
    // Alla perdita del focus, formattiamo in modo pulito il valore numerico
    setInputValue(value === 0 ? '' : value.toString());
  };

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
        {label}
      </label>
      <input
        type="text"
        inputMode="decimal"
        value={inputValue}
        placeholder={placeholder}
        className={className}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
      />
    </div>
  );
}

// ==========================================
// COMPONENTE FORM PRINCIPALE
// ==========================================
export default function CostForm({ preset, onUpdate }: CostFormProps) {
  const { materiaPrima, costiFissiEVariabili, numeroBottiglie, nome, marginePercentuale, provvigionePercentuale } = preset;

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
        {/* Costo Materia Prima controllato dal nostro wrapper */}
        <DecimalInput
          label={materiaPrima.tipo === 'UVA' ? 'Costo Uva (€/100g)' : 'Costo Vino (€/L)'}
          value={materiaPrima.costoUnitario}
          placeholder="0.00"
          className={inputClass}
          onChange={(val) => handleMateriaPrimaChange('costoUnitario', val)}
        />

        {materiaPrima.tipo === 'UVA' && (
          <DecimalInput
            label="Resa Uva/Vino (%)"
            value={materiaPrima.resaPercentuale ?? 70}
            placeholder="70"
            className={inputClass}
            onChange={(val) => handleMateriaPrimaChange('resaPercentuale', val)}
          />
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Sezione Confezionamento e Processo */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Costi Materiali e Confezionamento</h3>
        <div className="grid grid-cols-2 gap-4">
          <DecimalInput
            label="Bottiglia Vetro (€/cad)"
            value={costiFissiEVariabili.vetro || 0}
            placeholder="0.00"
            className={inputClass}
            onChange={(val) => handleCostiChange('vetro', val)}
          />
          <DecimalInput
            label="Tappo (€/cad)"
            value={costiFissiEVariabili.tappo || 0}
            placeholder="0.00"
            className={inputClass}
            onChange={(val) => handleCostiChange('tappo', val)}
          />
          <DecimalInput
            label="Capsula (€/cad)"
            value={costiFissiEVariabili.capsula || 0}
            placeholder="0.00"
            className={inputClass}
            onChange={(val) => handleCostiChange('capsula', val)}
          />
          <DecimalInput
            label="Etichetta (€/cad)"
            value={costiFissiEVariabili.etichetta || 0}
            placeholder="0.00"
            className={inputClass}
            onChange={(val) => handleCostiChange('etichetta', val)}
          />
          <DecimalInput
            label="Cartone (€/bottiglia)"
            value={costiFissiEVariabili.cartone || 0}
            placeholder="Es. Costo Scatola / 6"
            className={inputClass}
            onChange={(val) => handleCostiChange('cartone', val)}
          />
          <DecimalInput
            label="Imbottigliamento (€/bottiglia)"
            value={costiFissiEVariabili.imbottigliamento || 0}
            placeholder="Quota servizio/linea mobile"
            className={inputClass}
            onChange={(val) => handleCostiChange('imbottigliamento', val)}
          />
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Sezione Struttura, Utenze e Lavoro */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Processo, Logistica e Quote Allocate</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <DecimalInput
              label="Vinificazione (€/L di vino nel lotto)"
              value={costiFissiEVariabili.vinificazione || 0}
              placeholder="Costo energia/trattamenti al litro"
              className={inputClass}
              onChange={(val) => handleCostiChange('vinificazione', val)}
            />
          </div>
          <DecimalInput
            label="Utenze Allocate (€ fisso)"
            value={costiFissiEVariabili.utenze || 0}
            placeholder="Quota acqua/energia lotto"
            className={inputClass}
            onChange={(val) => handleCostiChange('utenze', val)}
          />
          <DecimalInput
            label="Mano d'opera (€ totale)"
            value={costiFissiEVariabili.manoDopera || 0}
            placeholder="Ore totali × tariffa oraria"
            className={inputClass}
            onChange={(val) => handleCostiChange('manoDopera', val)}
          />
          <div className="col-span-2">
            <DecimalInput
              label="Trasporto e Logistica (€/bottiglia)"
              value={costiFissiEVariabili.trasporto || 0}
              placeholder="Costo di spedizione unitario stimato"
              className={inputClass}
              onChange={(val) => handleCostiChange('trasporto', val)}
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Sezione Politiche Commerciali e Pricing */}
      <div>
        <h3 className="text-sm font-bold text-red-900 mb-3 uppercase tracking-wider">Politiche Commerciali e Pricing</h3>
        <div className="grid grid-cols-2 gap-4 print:break-inside-avoid">
          <DecimalInput
            label="Margine Utile (+ % Markup)"
            value={marginePercentuale || 0}
            placeholder="Es. 35%"
            className={inputClass}
            onChange={(val) => onUpdate({ marginePercentuale: val })}
          />
          <DecimalInput
            label="Provvigioni / Sconto (- %)"
            value={provvigionePercentuale || 0}
            placeholder="Es. 15%"
            className={inputClass}
            onChange={(val) => onUpdate({ provvigionePercentuale: Math.min(100, val) })}
          />
        </div>
      </div>
    </div>
  );
}