import { useState, useEffect } from 'react';
import type { WinePreset, CostiConfig } from '../types/wine';
import DecimalInput from './DecimalInput'; // Controlla se la 'D' è maiuscola o minuscola nel tuo file system!

interface CostFormProps {
  preset: WinePreset;
  onUpdate: (fields: Partial<WinePreset>) => void;
}

// ==========================================
// COMPONENTE FORM PRINCIPALE
// ==========================================
export default function CostForm({ preset, onUpdate }: CostFormProps) {
  const { materiaPrima, costiFissiEVariabili, numeroBottiglie, nome, marginePercentuale, provvigionePercentuale } = preset;

  // Stato locale per consentire all'utente di svuotare e digitare liberamente il numero di bottiglie
  const [bottiglieText, setBottiglieText] = useState<string>(numeroBottiglie.toString());

  // Sincronizza lo stato locale se il preset viene aggiornato esternamente
  useEffect(() => {
    setBottiglieText(numeroBottiglie.toString());
  }, [numeroBottiglie]);

  const handleBottiglieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Accetta solo stringhe vuote (durante la cancellazione) o numeri interi positivi
    if (val === '' || /^\d+$/.test(val)) {
      setBottiglieText(val);
      
      const parsed = parseInt(val, 10);
      // Aggiorna lo stato globale solo se è un numero valido e definitivo
      if (!isNaN(parsed) && parsed > 0) {
        onUpdate({ numeroBottiglie: parsed });
      }
    }
  };

  const handleBottiglieBlur = () => {
    const parsed = parseInt(bottiglieText, 10);
    // Se l'utente esce lasciando vuoto o 0, ripristina il valore minimo di sicurezza (1)
    if (isNaN(parsed) || parsed <= 0) {
      setBottiglieText('1');
      onUpdate({ numeroBottiglie: 1 });
    } else {
      // Pulisce eventuali zeri iniziali digitati per errore (es. "0500" -> "500")
      setBottiglieText(parsed.toString());
      onUpdate({ numeroBottiglie: parsed });
    }
  };

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
            type="text"
            inputMode="numeric"
            value={bottiglieText}
            className={inputClass}
            onChange={handleBottiglieChange}
            onBlur={handleBottiglieBlur}
            onFocus={(e) => e.target.select()}
            placeholder="1"
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
            Uva (€/Kg)
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
            {materiaPrima.tipo === 'UVA' ? 'Costo Uva (€/Kg)' : 'Costo Vino (€/L)'}
          </label>
          <DecimalInput
            value={materiaPrima.costoUnitario}
            placeholder="0.0000"
            className={inputClass}
            onChange={(val: number) => handleMateriaPrimaChange('costoUnitario', val)}
          />
        </div>

        {materiaPrima.tipo === 'UVA' && (
          <div>
            <label className={labelClass}>Resa Uva/Vino (%)</label>
            <DecimalInput
              value={materiaPrima.resaPercentuale || 70}
              placeholder="70"
              className={inputClass}
              onChange={(val: number) => handleMateriaPrimaChange('resaPercentuale', val)}
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
            <label className={labelClass}>Bottiglia Vetro (€/cad)</label>
            <DecimalInput
              value={costiFissiEVariabili.vetro}
              placeholder="0.0000"
              className={inputClass}
              onChange={(val: number) => handleCostiChange('vetro', val)}
            />
          </div>
          <div>
            <label className={labelClass}>Tappo (€/cad)</label>
            <DecimalInput
              value={costiFissiEVariabili.tappo}
              placeholder="0.0000"
              className={inputClass}
              onChange={(val: number) => handleCostiChange('tappo', val)}
            />
          </div>
          <div>
            <label className={labelClass}>Capsula (€/cad)</label>
            <DecimalInput
              value={costiFissiEVariabili.capsula}
              placeholder="0.0000"
              className={inputClass}
              onChange={(val: number) => handleCostiChange('capsula', val)}
            />
          </div>
          <div>
            <label className={labelClass}>Etichetta (€/cad)</label>
            <DecimalInput
              value={costiFissiEVariabili.etichetta}
              placeholder="0.0000"
              className={inputClass}
              onChange={(val: number) => handleCostiChange('etichetta', val)}
            />
          </div>
          <div>
            <label className={labelClass}>Cartone (€/bottiglia)</label>
            <DecimalInput
              value={costiFissiEVariabili.cartone}
              placeholder="Es. Costo Scatola / 6"
              className={inputClass}
              onChange={(val: number) => handleCostiChange('cartone', val)}
            />
          </div>
          <div>
            <label className={labelClass}>Imbottigliamento (€/bottiglia)</label>
            <DecimalInput
              value={costiFissiEVariabili.imbottigliamento}
              placeholder="Quota servizio/linea mobile"
              className={inputClass}
              onChange={(val: number) => handleCostiChange('imbottigliamento', val)}
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Sezione Struttura, Utenze e Lavoro */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Processo, Logistica e Quote Allocate</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>Vinificazione (€/L di vino nel lotto)</label>
            <DecimalInput
              value={costiFissiEVariabili.vinificazione}
              placeholder="Costo energia/trattamenti al litro"
              className={inputClass}
              onChange={(val: number) => handleCostiChange('vinificazione', val)}
            />
          </div>
          <div>
            <label className={labelClass}>Utenze Allocate (€ fisso)</label>
            <DecimalInput
              value={costiFissiEVariabili.utenze}
              placeholder="Quota acqua/energia lotto"
              className={inputClass}
              onChange={(val: number) => handleCostiChange('utenze', val)}
            />
          </div>
          <div>
            <label className={labelClass}>Mano d'opera (€ totale)</label>
            <DecimalInput
              value={costiFissiEVariabili.manoDopera}
              placeholder="Ore totali × tariffa oraria"
              className={inputClass}
              onChange={(val: number) => handleCostiChange('manoDopera', val)}
            />
          </div>
          <DecimalInput
            value={costiFissiEVariabili.utenze || 0}
            placeholder="Quota acqua/energia lotto"
            className={inputClass}
            onChange={(val) => handleCostiChange('utenze', val)}
          />
          <DecimalInput
            value={costiFissiEVariabili.manoDopera || 0}
            placeholder="Ore totali × tariffa oraria"
            className={inputClass}
            onChange={(val) => handleCostiChange('manoDopera', val)}
          />
          <div className="col-span-2">
            <label className={labelClass}>Trasporto e Logistica (€/bottiglia)</label>
            <DecimalInput
              value={costiFissiEVariabili.trasporto}
              placeholder="Costo di spedizione unitario stimato"
              className={inputClass}
              onChange={(val: number) => handleCostiChange('trasporto', val)}
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Sezione Politiche Commerciali e Pricing */}
      <div>
        <h3 className="text-sm font-bold text-red-900 mb-3 uppercase tracking-wider">Politiche Commerciali e Pricing</h3>
        <div className="grid grid-cols-2 gap-4 print:break-inside-avoid">
          <div>
            <label className={labelClass}>Margine Utile (+ % Markup)</label>
            <DecimalInput
              value={marginePercentuale}
              placeholder="Es. 35%"
              className={inputClass}
              onChange={(val: number) => onUpdate({ marginePercentuale: Math.max(0, val) })}
            />
          </div>
          <div>
            <label className={labelClass}>Provvigioni / Sconto (- %)</label>
            <DecimalInput
              value={provvigionePercentuale}
              placeholder="Es. 15%"
              className={inputClass}
              onChange={(val: number) => onUpdate({ provvigionePercentuale: Math.min(100, Math.max(0, val)) })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}