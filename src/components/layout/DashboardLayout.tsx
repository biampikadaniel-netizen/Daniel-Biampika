import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, type AppRoute } from '../../context/NavigationContext';
import { notificationsStorage } from '../../services/storage';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Users,
  Package,
  Boxes,
  CreditCard,
  MessageSquareShare,
  BarChart3,
  Users2,
  Settings,
  CreditCard as SubscriptionIcon,
  LogOut,
  Bell,
  Search,
  Plus,
  Zap,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onOpenFastInvoice?: () => void;
}

export function DashboardLayout({ children, onOpenFastInvoice }: DashboardLayoutProps) {
  const { currentUser, logout } = useAuth();
  const { currentRoute, navigate } = useNavigation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) return null;

  const notifications = notificationsStorage.getAll(currentUser.id);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Compute trial days remaining
  const now = Date.now();
  const trialEnds = currentUser.trialEndsAt || now + 14 * 24 * 60 * 60 * 1000;
  const daysRemaining = Math.max(0, Math.ceil((trialEnds - now) / (1000 * 60 * 60 * 24)));
  const trialProgress = Math.min(100, Math.max(0, ((14 - daysRemaining) / 14) * 100));

  const navItems = [
    { label: 'Tableau de bord', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Devis', route: '/quotes', icon: FileText },
    { label: 'Factures', route: '/invoices', icon: Receipt },
    { label: 'Clients', route: '/clients', icon: Users },
    { label: 'Produits & Services', route: '/products', icon: Package },
    { label: 'Stock', route: '/stock', icon: Boxes },
    { label: 'Paiements', route: '/payments', icon: CreditCard },
    { label: 'Relances WhatsApp', route: '/reminders', icon: MessageSquareShare },
    { label: 'Rapports', route: '/reports', icon: BarChart3 },
    { label: 'Équipe', route: '/team', icon: Users2 },
    { label: 'Abonnement', route: '/subscription', icon: SubscriptionIcon },
    { label: 'Paramètres', route: '/settings', icon: Settings },
  ];

  const handleMarkAllRead = () => {
    notificationsStorage.markAllAsRead(currentUser.id);
    setNotificationsOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Logo */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
            <button
              onClick={() => {
                navigate('/dashboard');
                setSidebarOpen(false);
              }}
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-left cursor-pointer"
            >
              <img src="/icon.svg" alt="Chapfacture" className="h-7 w-7" />
              <span>
                <span className="text-[#295294]">Chap</span>
                <span className="text-[#f27a2c]">facture</span>
              </span>
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Company Pill */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Espace Entreprise</p>
            <p className="text-sm font-bold text-slate-900 truncate">{currentUser.companyName}</p>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => {
                    navigate(item.route as AppRoute);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200/60 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          {/* Trial Status Pill */}
          <div
            onClick={() => navigate('/subscription')}
            className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-200/70 cursor-pointer hover:border-teal-300 transition-all"
          >
            <div className="flex items-center justify-between text-xs font-bold text-teal-800">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Essai Entreprise
              </span>
              <span>{daysRemaining}j restants</span>
            </div>
            <div className="w-full bg-teal-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${100 - trialProgress}%` }}
              />
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80"
            >
              <div className="w-8 h-8 rounded-full bg-[#295294] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {currentUser.name.substring(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Déconnexion"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* View Public Site link */}
          <button
            onClick={() => navigate('/')}
            className="w-full text-center text-[11px] font-semibold text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Voir le site public</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Hamburger on mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search */}
            <div className="relative hidden sm:block w-64 lg:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher facture, devis, client..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Fast Invoice button (< 30s) */}
            <button
              onClick={onOpenFastInvoice}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-tr from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-sm shadow-teal-500/20 transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span className="hidden xs:inline">Facture rapide</span>
              <span className="xs:hidden">Facture</span>
              <span className="hidden lg:inline text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-mono">
                &lt; 30s
              </span>
            </button>

            {/* Notifications Popover Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-semibold text-teal-600 hover:text-teal-800 cursor-pointer"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 p-2 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        Aucune notification pour le moment.
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            notificationsStorage.markAsRead(currentUser.id, notif.id);
                            if (notif.link) navigate(notif.link);
                            setNotificationsOpen(false);
                          }}
                          className={`p-2.5 rounded-xl transition-colors cursor-pointer text-left ${
                            !notif.read ? 'bg-teal-50/50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold text-slate-800">{notif.title}</p>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {new Date(notif.createdAt).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Help Button */}
            <button
              onClick={() => setHelpModalOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Centre d'aide"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#295294] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {currentUser.name.substring(0, 2)}
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.companyName}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      Mon profil &amp; Paramètres
                    </button>
                    <button
                      onClick={() => {
                        navigate('/subscription');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      Mon abonnement (Entreprise)
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900">
                <HelpCircle className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold">Centre d'aide Chapfacture</h3>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>
                Besoin d'aide ou d'assistance sur l'utilisation de Chapfacture ? Notre équipe d'assistance francophone
                est disponible 7j/7.
              </p>
              <div className="rounded-2xl bg-teal-50 p-4 border border-teal-200/60">
                <p className="font-bold text-teal-900 text-xs uppercase tracking-wider">Support WhatsApp direct</p>
                <p className="text-xs text-teal-700 mt-1">
                  Échangez en direct avec notre équipe technique sur WhatsApp.
                </p>
                <a
                  href="https://wa.me/2250700000000?text=Bonjour,%20j'ai%20besoin%20d'aide%20sur%20mon%20compte%20Chapfacture."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-xl shadow-xs"
                >
                  Ouvrir WhatsApp (+225 07 00 00 00 00)
                </a>
              </div>
            </div>
            <button
              onClick={() => setHelpModalOpen(false)}
              className="mt-5 w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
