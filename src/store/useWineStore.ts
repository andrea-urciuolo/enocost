import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WinePreset } from '../types/wine';

interface WineState {
  presets: WinePreset[];
  selectedPresetId: string | null;
  // Actions
  addPreset: (preset: Omit<WinePreset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePreset: (id: string, updatedFields: Partial<WinePreset>) => void;
  deletePreset: (id: string) => void;
  selectPreset: (id: string | null) => void;
}

export const useWineStore = create<WineState>()(
  persist(
    (set) => ({
      presets: [],
      selectedPresetId: null,

      addPreset: (newPresetData) => set((state) => {
        const isoString = new Date().toISOString();
        const newPreset: WinePreset = {
          ...newPresetData,
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
          createdAt: isoString,
          updatedAt: isoString,
        };
        return {
          presets: [newPreset, ...state.presets],
          selectedPresetId: newPreset.id // Seleziona automaticamente il preset appena creato
        };
      }),

      updatePreset: (id, updatedFields) => set((state) => ({
        presets: state.presets.map((preset) =>
          preset.id === id
            ? {
                ...preset,
                ...updatedFields,
                // Aggiorna le sotto-strutture se passate parzialmente
                materiaPrima: { ...preset.materiaPrima, ...updatedFields.materiaPrima },
                costiFissiEVariabili: { ...preset.costiFissiEVariabili, ...updatedFields.costiFissiEVariabili },
                updatedAt: new Date().toISOString(),
              }
            : preset
        ),
      })),

      deletePreset: (id) => set((state) => ({
        presets: state.presets.filter((preset) => preset.id !== id),
        selectedPresetId: state.selectedPresetId === id ? null : state.selectedPresetId,
      })),

      selectPreset: (id) => set({ selectedPresetId: id }),
    }),
    {
      name: 'enocost-storage', // Chiave univoca nel LocalStorage
    }
  )
);