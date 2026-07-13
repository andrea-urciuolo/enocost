export type MateriaPrimaType = 'UVA' | 'VINO';

export interface CostiConfig {
  tappo: number;           // € / unità
  capsula: number;         // € / unità
  etichetta: number;       // € / unità
  cartone: number;         // € / ripartito per singola bottiglia (es. costo scatola / 6)
  manoDopera: number;      // € / ora o assegnato per bottiglia
  utenze: number;          // € / quota allocata
  vinificazione: number;   // € / litro o lotto
  imbottigliamento: number;// € / unità
}

export interface MateriaPrimaInput {
  tipo: MateriaPrimaType;
  costoUnitario: number;      // €/100g (hg) se UVA, €/L se VINO
  resaPercentuale?: number;   // Es. 70 (usato solo se tipo è UVA)
}

export interface WinePreset {
  id: string;                 // UUID v4 per identificazione univoca
  nome: string;               // Es. "Aglianico 2024"
  createdAt: string;          // Timestamp ISO
  updatedAt: string;          // Timestamp ISO
  materiaPrima: MateriaPrimaInput;
  costiFissiEVariabili: CostiConfig;
  numeroBottiglie: number;    // Default: 1
}

// Stato iniziale di default per i nuovi form
export const DEFAULT_PRESET_VALUES: Omit<WinePreset, 'id' | 'createdAt' | 'updatedAt'> = {
  nome: '',
  materiaPrima: {
    tipo: 'UVA',
    costoUnitario: 0,
    resaPercentuale: 70 // Default standard 70%
  },
  costiFissiEVariabili: {
    tappo: 0,
    capsula: 0,
    etichetta: 0,
    cartone: 0,
    manoDopera: 0,
    utenze: 0,
    vinificazione: 0,
    imbottigliamento: 0
  },
  numeroBottiglie: 1
};