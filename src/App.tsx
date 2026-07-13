// src/App.tsx
import { useWineStore } from './store/useWineStore';
import { DEFAULT_PRESET_VALUES } from './types/wine';
import { calculateCogs } from './utils/calculationEngine';
import CostForm from './components/costForm';
import CogsDashboard from './components/CogsDashboard';

export default function App() {
  const { presets, selectedPresetId, addPreset, updatePreset, deletePreset, selectPreset } = useWineStore();

  const activePreset = presets.find((p) => p.id === selectedPresetId);
  const computedData = activePreset ? calculateCogs(activePreset) : null;

  const handleCreateNew = () => {
    addPreset({
      ...DEFAULT_PRESET_VALUES,
      nome: `Nuovo Preset ${presets.length + 1}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      {/* Header Mobile-Responsive */}
      <header className="bg-red-900 text-white p-4 shadow-md sticky top-0 z-50 flex justify-between items-center print:hidden">
        <h1 className="text-xl font-black tracking-tight">EnoCost <span className="text-xs font-normal opacity-75">v1.0 COGS</span></h1>
        <button
          onClick={handleCreateNew}
          className="bg-white text-red-900 font-bold px-4 py-2 rounded-lg text-sm shadow hover:bg-gray-100 transition-all min-h-[44px] flex items-center"
        >
          + Nuovo Vino
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 print:block print:p-0">
        
        {/* Colonna Navigazione Preset */}
        <div className="lg:col-span-1 space-y-4 print:hidden">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">I Tuoi Vini Salva</h2>
            {presets.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-4 text-center">Nessun vino salvato. Clicca su "+ Nuovo Vino" per iniziare.</p>
            ) : (
              <div className="space-y-2 max-h-[250px] lg:max-h-[500px] overflow-y-auto pr-1">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => selectPreset(preset.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center min-h-[48px] ${
                      selectedPresetId === preset.id
                        ? 'bg-red-50 border-red-300 text-red-900 font-semibold shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="truncate mr-2">{preset.nome || 'Senza nome'}</span>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Eliminare questo preset definitivamente?')) {
                          deletePreset(preset.id);
                        }
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zona di Lavoro: Form e Output */}
        {activePreset && computedData ? (
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 print:flex print:flex-col">
            <div className="order-2 md:order-1 print:block">
              <CostForm
                preset={activePreset}
                onUpdate={(fields) => updatePreset(activePreset.id, fields)}
              />
            </div>
          {/* Spostiamo la dashboard in cima nel PDF usando l'ordine di stampa se necessario, o lasciamoli fluire */}
            <div className="order-1 md:order-2 print:order-first print:mb-8">
              <CogsDashboard breakdown={computedData} activePreset={activePreset} />
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-8 bg-white border border-dashed border-gray-300 rounded-2xl min-h-[300px]">
            <span className="text-4xl mb-2">🍷</span>
            <p className="text-gray-500 text-center font-medium">Seleziona un vino dall'elenco o creane uno nuovo per avviare il calcolo del costo industriale.</p>
          </div>
        )}
      </main>
    </div>
  );
}