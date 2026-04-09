import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { MetricCard } from '../components/MetricCard'
import { SkeletonLoader } from '../components/Loading'
import { useData } from '../hooks/useData'
import { apiService } from '../api'
import { TrendingUp } from 'lucide-react'

export const DashboardView: React.FC = () => {
  const { data: kpiData, loading: kpiLoading } = useData(() => apiService.getKPIGlobaux())
  const { data: topProdutos, loading: topLoading } = useData(() => apiService.getTopProduits())
  const { data: categoriesData, loading: categoriesLoading } = useData(() => apiService.getCategories())
  const { data: temporalData, loading: temporalLoading } = useData(() => apiService.getTemporalData())

  if (kpiLoading || topLoading || categoriesLoading || temporalLoading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader className="h-32" />
        <SkeletonLoader className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* KPIs Globaux */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
          <TrendingUp className="text-blue-500" /> Vue d'ensemble
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiData && (
            <>
              <MetricCard
                title="Chiffre d'affaires"
                value={kpiData.ca_total}
                unit="€"
                description="Ventes totales"
              />
              <MetricCard
                title="Nombre de commandes"
                value={kpiData.nb_commandes}
                description="Total commandes"
              />
              <MetricCard
                title="Nombre de clients"
                value={kpiData.nb_clients}
                description="Clients uniques"
              />
              <MetricCard
                title="Profit total"
                value={kpiData.profit_total}
                unit="€"
                trend={kpiData.marge_moyenne}
              />
              <MetricCard
                title="Panier moyen"
                value={kpiData.valeur_panier_moyen}
                unit="€"
                description="Valeur moyenne par commande"
              />
              <MetricCard
                title="Marge moyenne"
                value={(kpiData.marge_moyenne * 100).toFixed(1)}
                unit="%"
                description="Rentabilité moyenne"
              />
            </>
          )}
        </div>
      </div>

      {/* Top Produits */}
      {topProdutos && topProdutos.produits.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Top 10 Produits</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProdutos.produits.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="produit" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Bar dataKey="ca" fill="#3b82f6" name="CA (€)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="profit" fill="#10b981" name="Profit (€)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Évolution temporelle */}
      {temporalData && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Évolution des ventes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temporalData.analyse_temporelle || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Line type="monotone" dataKey="ca_cumule" stroke="#3b82f6" name="CA cumulé (€)" strokeWidth={2} />
              <Line type="monotone" dataKey="profit_cumule" stroke="#10b981" name="Profit cumulé (€)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Catégories */}
      {categoriesData && categoriesData.categories.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Performance par catégorie</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400">Catégorie</th>
                  <th className="text-right py-3 px-4 text-slate-400">CA</th>
                  <th className="text-right py-3 px-4 text-slate-400">Profit</th>
                  <th className="text-right py-3 px-4 text-slate-400">Marge</th>
                  <th className="text-right py-3 px-4 text-slate-400">Commandes</th>
                </tr>
              </thead>
              <tbody>
                {categoriesData.categories.map((cat, idx) => (
                  <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-slate-200">{cat.categorie}</td>
                    <td className="text-right py-3 px-4 text-slate-300">{cat.ca.toLocaleString('fr-FR')} €</td>
                    <td className="text-right py-3 px-4 text-green-400">{cat.profit.toLocaleString('fr-FR')} €</td>
                    <td className="text-right py-3 px-4 text-blue-400">{(cat.marge * 100).toFixed(1)}%</td>
                    <td className="text-right py-3 px-4 text-slate-400">{cat.nb_commandes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
