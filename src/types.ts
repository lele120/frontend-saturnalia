export interface Item {
  id: number;
  name: string;
  description: string;
  price: string | number;
}

export interface Particella {
  comune: string;
  sezione?: string;
  foglio: number;
  particella: number;
}

export interface TerrenoCreate {
  nome: string;
  area_coltivata_m2: number;
  particelle: Particella[];
}

export interface Terreno {
  id: number;
  nome: string;
  comune: string;
  area_coltivata_m2: number;
  superficie_catastale_totale: number;
  numero_particelle: number;
}

export interface ParticellaLookup {
  comune: string;
  sezione: string;
  foglio: number;
  particella: number;
  superficie_m2: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details: string;
}