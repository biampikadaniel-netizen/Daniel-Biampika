import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  FileCheck2,
  Users,
  Package,
  Boxes,
  Wallet,
  MessageCircle,
  BarChart3,
  UserPlus,
  CreditCard,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Zap,
  Clock,
  Globe,
  FilePlus2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, AppRoute } from '../../context/NavigationContext';
import { workspaceService } from '../../services/storage';
import { NotificationItem } from '../../types';
import { FaktelioLogo } from '../common/FaktelioLogo';

interface NavEntry {
  label: string;
  route: AppRoute;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

// Exact Sidebar items requested in Section 10:
// Dashboard, Clients & CRM, Catalogue, Facturation, Devis, Factures, Paiements, Stock, WhatsApp, Analyses, Équipe, Paramètres
const sidebarItems: NavEntry[] = [
  { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
  { label: 'Clients & CRM', route: '/clients', icon: Users },
  { label: 'Catalogue', route: '/products', icon: Package },
  { label: 'Facturation', route: '/billing', icon: FilePlus2, badge: 'Nouveau' },
  { label: 'Devis', route: '/quotes', icon: FileCheck2 },
  { label: 'Factures', route: '/invoices', icon: FileText },
  { label: 'Paiements', route: '/payments', icon: Wallet },
  { label: 'Stock', route: '/stock', icon: Boxes },
  { label: 'WhatsApp', route: '/reminders', icon: MessageCircle, badge: 'Relances' },
  { label: 'Analyses', route: '/reports', icon: BarChart3 },
  { label: 'Équipe', route: '/team', icon: UserPlus },
  { label: 'Paramètres', route: '/settings', icon: Settings },
];

export function DashboardLayout({
  children,
  onOpenFastInvoice,
}: {
  children: React.ReactNode;
  onOpenFastInvoice: () => void;
}) {
  const { user, logout } = useAuth();
  const { route, navigate } = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (user) {
      setNotifications(workspaceService.getNotifications(user.id));
    }
  }, [user, route]);

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const trialDaysLeft = Math.max(
    0,
    Math.ceil((user.trialEndsAt - Date.now()) / (1000 * 60 * 60 * 24))
  );

  const handleMarkRead = () => {
    workspaceService.markAllNotificationsRead(user.id);
    setNotifications(workspaceService.getNotifications(user.id));
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col lg:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1E4F91] text-white flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/15">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 text-left cursor-pointer"
          >
            <FaktelioLogo variant="white" size="sm" />
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fast Invoice Trigger Button */}
        <div className="p-4 border-b border-white/10">
          <button
            onClick={() => {
              setSidebarOpen(false);
              onOpenFastInvoice();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(244,123,32,0.35)] transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            Facture Express (+30s)
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = route === item.route;
            return (
              <button
                key={item.route}
                onClick={() => {
                  setSidebarOpen(false);
                  navigate(item.route);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-white text-[#1E4F91] shadow-xs font-bold'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#F47B20]' : 'text-white/80'}`} />
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      active ? 'bg-[#F47B20] text-white' : 'bg-[#F47B20]/90 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Trial & Subscription Footer */}
        <div className="p-4 border-t border-white/15 space-y-3 bg-[#163C70]/50">
          <div className="p-3 rounded-xl bg-white/10 border border-white/15">
            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
              <span className="flex items-center gap-1.5 text-[#F47B20]">
                <Clock className="w-3.5 h-3.5" />
                Essai Gratuit
              </span>
              <span className="text-white">{trialDaysLeft} j restants</span>
            </div>
            <p className="text-[11px] text-white/80 leading-snug mb-2">
              Plan actuel : <strong className="uppercase text-white">FAKTELIO {user.plan}</strong>
            </p>
            <button
              onClick={() => navigate('/subscription')}
              className="w-full py-1.5 px-3 rounded-lg bg-white text-[#1E4F91] hover:bg-white/90 text-[11px] font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#F47B20]" />
              Gérer mon abonnement
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white font-medium cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              Site vitrine
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-red-200 hover:text-white font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#101828] hover:bg-[#F5F7FA]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-[#101828] leading-tight">
                {user.companyName}
              </h2>
              <p className="text-[11px] text-[#526581] hidden sm:block">
                Plateforme FAKTELIO • Cloud synchronisé en temps réel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/billing')}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E4F91]/10 hover:bg-[#1E4F91]/15 text-[#1E4F91] text-xs font-extrabold transition-all cursor-pointer"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              Facturation
            </button>

            <button
              onClick={onOpenFastInvoice}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              + Nouvelle Facture
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2.5 rounded-xl bg-[#F5F7FA] hover:bg-[#E2E8F0]/60 text-[#101828] transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F47B20] text-white text-[10px] font-extrabold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-3 z-50">
                  <div className="px-4 pb-2.5 border-b border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#101828] uppercase tracking-wider">
                      Notifications ({unreadCount})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkRead}
                        className="text-[11px] font-bold text-[#1E4F91] hover:underline cursor-pointer"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8F0]">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-[#526581] text-center">
                        Aucune notification pour le moment.
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setNotifOpen(false);
                            if (n.link) navigate(n.link as AppRoute);
                          }}
                          className={`p-3.5 hover:bg-[#F5F7FA] transition-colors cursor-pointer ${
                            !n.read ? 'bg-[#1E4F91]/4' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-[#101828]">{n.title}</p>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-[#F47B20] shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#526581] mt-1 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-full bg-[#1E4F91] text-white text-xs font-extrabold flex items-center justify-center">
                {user.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-[#101828] leading-none">{user.name}</p>
                <p className="text-[10px] text-[#526581] mt-0.5 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
