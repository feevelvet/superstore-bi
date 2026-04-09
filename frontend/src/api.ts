import axios from 'axios'

const API_URL = 'http://localhost:8001'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface KPIGlobaux {
  ca_total: number
  nb_commandes: number
  nb_clients: number
  profit_total: number
  marge_moyenne: number
  valeur_panier_moyen: number
}

export interface Produit {
  produit: string
  ca: number
  profit: number
  marge: number
}

export interface Categorie {
  categorie: string
  ca: number
  profit: number
  marge: number
  nb_commandes: number
}

export interface TopProduits {
  produits: Produit[]
}

export interface CategoriesData {
  categories: Categorie[]
}

export interface TempData {
  date: string
  ca_cumule: number
  profit_cumule: number
}

export interface TemporalData {
  analyse_temporelle: TempData[]
}

export interface Remise {
  remise_totale_montant: number
  nb_commandes_avec_remise: number
  remise_moyenne_pct: number
  profit_perdu_estimation: number
  pourcentage_commandes_remisees: number
  top_produits_remises: Array<{
    produit: string
    remise_moyenne_pct: number
    ca: number
    profit: number
    nb_commandes: number
  }>
}

export const apiService = {
  getKPIGlobaux: async (): Promise<KPIGlobaux> => {
    const { data } = await api.get('/kpi/globaux')
    return data
  },

  getTopProduits: async (): Promise<TopProduits> => {
    const { data } = await api.get('/kpi/produits/top')
    return data
  },

  getCategories: async (): Promise<CategoriesData> => {
    const { data } = await api.get('/kpi/categories')
    return data
  },

  getTemporalData: async (): Promise<TemporalData> => {
    const { data } = await api.get('/kpi/temporel')
    return data
  },

  getRemises: async (): Promise<Remise> => {
    const { data } = await api.get('/kpi/remises')
    return data
  },

  getGeographicData: async (): Promise<any> => {
    const { data } = await api.get('/kpi/geographique')
    return data
  },

  getClientsData: async (): Promise<any> => {
    const { data } = await api.get('/kpi/clients')
    return data
  },
}
