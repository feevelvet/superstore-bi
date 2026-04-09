import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { MetricCard } from '../components/MetricCard'
import { SkeletonLoader } from '../components/Loading'
import { useData } from '../hooks/useData'
import { apiService } from '../api'
import { Percent, AlertCircle } from 'lucide-react'

export const RemisesView: React.FC = () => {
  const { data: remisesData, loading } = useData(() => apiService.getRemises())

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader className="h-32" />
        <SkeletonLoader className="h-64" />
      </div>
    )
  }

  if (!remisesData) {
    return (
      <div className="card p-6 flex items-center gap-3">
        <AlertCircle className="text-red-500" />
        <p className="text-slate-300">Erreur lors du chargement des données</p>
      </div>
    )
  }

  const chartData = remisesData.top_produits_remises.slice(0, 8).map(p => ({
    name: p.produit.length > 20 ? p.produit.substring(0, 20) + '...' : p.produit,
    remise: p.remise_moyenne_pct,
    ca: p.ca,
    profit: p.profit,
  }))

  return (
    <div className="space-y-8">
      {/* KPIs Remises */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
          <Percent className="text-blue-500" /> Analyse des remises
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Total remises accordées"
            value={remisesData.remise_totale_montant}
            unit="€"
            description="Montant total des réductions"
          />
          <MetricCard
            title="Commandes remisées"
            value={remisesData.nb_commandes_avec_remise}
            description="Nombre de commandes avec réduction"
          />
          <MetricCard
            title="Remise moyenne"
            value={(remisesData.remise_moyenne_pct).toFixed(1)}
            unit="%"
            description="Pourcentage moyen de remise"
          />
          <MetricCard
            title="% commandes remisées"
            value={(remisesData.pourcentage_commandes_remisees).toFixed(1)}
            unit="%"
            trend={-remisesData.pourcentage_commandes_remisees}
            description="Part des commandes affectées"
          />
          <MetricCard
            title="Profit potentiel perdu"
            value={remisesData.profit_perdu_estimation}
            unit="€"
            description="Impact financier estimé"
          />
        </div>
      </div>

      {/* Graphique remises par produit */}
      {chartData.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Remises accordées par produit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="remise" fill="#ef4444" name="Remise moyenne %" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="right" dataKey="ca" fill="#3b82f6" name="CA (€)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Scatter CA vs Profit */}
      {remisesData.top_produits_remises.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">CA vs Profit (par produit remisé)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" dataKey="ca" name="CA" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis type="number" dataKey="profit" name="Profit" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Scatter
                name="Produits"
                data={remisesData.top_produits_remises}
                fill="#3b82f6"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tableau détaillé */}
      {remisesData.top_produits_remises.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Détail des produits remisés</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400">Produit</th>
                  <th className="text-right py-3 px-4 text-slate-400">Remise moy.</th>
                  <th className="text-right py-3 px-4 text-slate-400">CA</th>
                  <th className="text-right py-3 px-4 text-slate-400">Profit</th>
                  <th className="text-right py-3 px-4 text-slate-400">Commandes</th>
                </tr>
              </thead>
              <tbody>
                {remisesData.top_produits_remises.map((prod, idx) => (
                  <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-slate-200 truncate">{prod.produit}</td>
                    <td className="text-right py-3 px-4">
                      <span className="inline-block bg-red-900/30 text-red-400 px-2 py-1 rounded">{prod.remise_moyenne_pct.toFixed(1)}%</span>
                    </td>
                    <td className="text-right py-3 px-4 text-slate-300">{prod.ca.toLocaleString('fr-FR')} €</td>
                    <td className="text-right py-3 px-4 text-green-400">{prod.profit.toLocaleString('fr-FR')} €</td>
                    <td className="text-right py-3 px-4 text-slate-400">{prod.nb_commandes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="grid grid-cols-1 gap-4">
        <div className="card p-6 bg-blue-900/20 border-blue-800/50">
          <div className="flex gap-3">
            <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-blue-400 mb-1">Insights stratégiques</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• {((remisesData.pourcentage_commandes_remisees).toFixed(1))}% des commandes bénéficient d'une remise</li>
                <li>• Impact financier: {remisesData.profit_perdu_estimation.toLocaleString('fr-FR')} € de profit perdu</li>
                <li>• Remise moyenne: {remisesData.remise_moyenne_pct.toFixed(1)}% par commande</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
