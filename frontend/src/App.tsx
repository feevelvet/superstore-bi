import { useState } from 'react'
import { BarChart3, Percent, Settings, Menu, X, Home } from 'lucide-react'
import { DashboardView } from './views/DashboardView'
import { RemisesView } from './views/RemisesView'

type ViewType = 'dashboard' | 'remises'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    {
      id: 'dashboard' as ViewType,
      icon: <Home size={20} />,
      label: 'Dashboard',
      description: 'Vue d\'ensemble',
    },
    {
      id: 'remises' as ViewType,
      icon: <Percent size={20} />,
      label: 'Remises',
      description: 'Analyse des discounts',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                  Superstore BI
                </h1>
                <p className="text-xs text-slate-500">Business Intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">API Connected</span>
            </div>
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-60px)]">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-slate-900/30 border-r border-slate-800 transition-all duration-300 overflow-hidden`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id)
                  setSidebarOpen(false) // Close on mobile
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                }`}
              >
                {item.icon}
                <div className="text-left">
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </button>
            ))}

            {/* Footer dans la sidebar */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-400 mb-2">Version</p>
                <p className="text-sm font-semibold text-slate-200">1.0.0</p>
                <p className="text-xs text-slate-500 mt-2">React + FastAPI</p>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                <span>Dashboard</span>
                <span className="text-slate-600">/</span>
                <span className="text-blue-400">
                  {menuItems.find(m => m.id === currentView)?.label}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-100">
                {menuItems.find(m => m.id === currentView)?.label}
              </h1>
              <p className="text-slate-400 mt-2">
                {menuItems.find(m => m.id === currentView)?.description}
              </p>
            </div>

            {/* Content */}
            <div className="animate-fade-in">
              {currentView === 'dashboard' && <DashboardView />}
              {currentView === 'remises' && <RemisesView />}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
