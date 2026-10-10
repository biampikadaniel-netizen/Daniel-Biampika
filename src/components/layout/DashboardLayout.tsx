import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  FileText,
  FileCheck2,
  Users,
  Package,
  Boxes,
  CreditCard,
  MessageCircle,
  BarChart3,
  UserPlus,
  Settings,
  Bell,
  Mail,
  LogOut,
  Menu,
  X,
  Zap,
  Search,
  ChevronDown,
  Headphones,
  Globe,
  Clock,
  Check,
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

const sidebarItems: NavEntry[] = [
  { label: 'Dashboard', route: '/dashboard', icon: Home },
  { label: 'Clients & CRM', route: '/clients', icon: Users },
  { label: 'Catalogue', route: '/products', icon: Package },
  { label: 'Facturation', route: '/billing', icon: FileText, badge: 'Nouveau' },
  { label: 'Devis', route: '/quotes', icon: FileCheck2 },
  { label: 'Factures', route: '/invoices', icon: FileText },
  { label: 'Paiements', route: '/payments', icon: CreditCard },
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setNotifications(workspaceService.getNotifications(user.id));
    }
  }, [user, route]);

  // Keyboard shortcut: Cmd+K or Ctrl+K focuses the search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const userInitials = user.name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'UD';

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#0E1A16] font-sans antialiased p-3 sm:p-4 lg:p-5 flex flex-col lg:flex-row gap-5 items-start">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0E1A16]/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ==============================================================
          SIDEBAR — EXACT PIXEL-PERFECT REPRODUCTION FROM REFERENCE IMAGE
          Floating white rounded card with mint accents and bottom wave
         ============================================================== */}
      <aside
        className={`fixed inset-y-3 left-3 z-50 w-64 xl:w-72 bg-white rounded-[26px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 lg:min-h-[calc(100vh-2.5rem)] lg:self-stretch overflow-hidden shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0 relative z-10">
          {/* Top: Brand Logo */}
          <div className="pt-6 px-6 pb-2 flex items-center justify-between">
            <button
              onClick={() => {
                setSidebarOpen(false);
                navigate('/dashboard');
              }}
              className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
            >
              <FaktelioLogo variant="admin" size="md" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Label: MENU */}
          <div className="px-6 pt-5 pb-2">
            <span className="text-[11px] font-black tracking-wider text-gray-400 uppercase">
              MENU
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto pr-2">
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
                  className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer group ${
                    active
                      ? 'bg-[#E8F3ED] text-[#104B38] font-extrabold'
                      : 'text-[#65736B] hover:text-[#104B38] hover:bg-[#E8F3ED]/50 font-semibold'
                  }`}
                >
                  {/* Active Indicator on far left */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#176B4D] rounded-r-full" />
                  )}

                  <span className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        active
                          ? 'text-[#176B4D]'
                          : 'text-[#65736B] group-hover:text-[#17231D]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-[#176B4D] text-white shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card: "Besoin d'aide ?" & Decorative Wave */}
        <div className="relative z-10 pt-2 pb-2">
          <div className="mx-4 mb-3 p-3.5 rounded-2xl bg-[#F7F9F7] border border-[#DCE5DE] shadow-xs relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white border border-[#DCE5DE] text-[#176B4D] flex items-center justify-center shrink-0 shadow-2xs">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#17231D] leading-tight">
                  Besoin d&apos;aide ?
                </p>
                <p className="text-[10px] text-[#65736B] leading-tight mt-0.5 truncate">
                  Notre équipe est là pour vous.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSupportModalOpen(true)}
              className="w-full mt-3 py-2 px-3 rounded-xl bg-[#176B4D] hover:bg-[#104B38] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              Contacter le support →
            </button>
          </div>

          {/* Decorative Wave Gradient at the bottom of sidebar (matching reference image) */}
          <div className="h-10 overflow-hidden pointer-events-none relative -mt-4 opacity-75">
            <svg
              viewBox="0 0 280 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full object-cover"
              preserveAspectRatio="none"
            >
              <path
                d="M0 24 C 70 8, 140 36, 210 18 C 245 10, 265 16, 280 20 L 280 48 L 0 48 Z"
                fill="#E8F3ED"
              />
              <path
                d="M0 34 C 80 22, 170 42, 280 28 L 280 48 L 0 48 Z"
                fill="#DCE5DE"
                fillOpacity="0.4"
              />
            </svg>
          </div>
        </div>
      </aside>

      {/* ==============================================================
          MAIN CONTENT COLUMN (TOP BAR + PAGE BODY)
         ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 w-full gap-5">
        {/* ==============================================================
            HEADER (TOP BAR) — FLOATING WHITE PILL CARDS
           ============================================================== */}
        <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Left / Search Pill Card */}
          <div className="flex-1 bg-white rounded-2xl sm:rounded-full border border-[#DCE5DE] shadow-[0_2px_12px_rgba(0,0,0,0.02)] px-4 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 -ml-1 rounded-xl text-[#65736B] hover:bg-[#E8F3ED] cursor-pointer shrink-0"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              <Search className="w-4 h-4 text-[#65736B] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Rechercher une tâche, un client..."
                className="bg-transparent border-0 outline-none text-xs sm:text-sm text-[#17231D] placeholder:text-[#65736B] w-full focus:ring-0 leading-normal"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono font-medium bg-[#E8F3ED] text-[#65736B] rounded-md border border-[#DCE5DE] shrink-0 select-none">
                ⌘ K
              </kbd>
            </div>

            {/* Quick Action Icons inside Search Card */}
            <div className="flex items-center gap-2 shrink-0 pl-2 border-l border-[#DCE5DE]">
              <button
                onClick={() => navigate('/reminders')}
                title="Messages & Relances"
                className="w-9 h-9 rounded-full border border-[#DCE5DE] flex items-center justify-center text-[#65736B] hover:text-[#176B4D] hover:bg-[#E8F3ED] transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  title="Notifications"
                  className="w-9 h-9 rounded-full border border-[#DCE5DE] flex items-center justify-center text-[#65736B] hover:text-[#176B4D] hover:bg-[#E8F3ED] transition-colors relative cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#176B4D]" />
                  )}
                </button>

                {/* Notifications Popup */}
                {notifOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-[#DCE5DE] py-3 z-50">
                    <div className="px-4 pb-2.5 border-b border-[#DCE5DE] flex items-center justify-between">
                      <span className="text-xs font-black text-[#17231D] uppercase tracking-wider">
                        Notifications ({unreadCount})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkRead}
                          className="text-[11px] font-bold text-[#176B4D] hover:underline cursor-pointer"
                        >
                          Tout marquer comme lu
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#DCE5DE]">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-xs text-[#65736B] text-center">
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
                            className={`p-3.5 hover:bg-[#E8F3ED]/40 transition-colors cursor-pointer ${
                              !n.read ? 'bg-[#E8F3ED]/60' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold text-[#17231D]">{n.title}</p>
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-[#176B4D] shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-[#65736B] mt-1 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right / User Profile Pill Card */}
          <div className="relative shrink-0">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full sm:w-auto bg-white rounded-2xl sm:rounded-full border border-[#DCE5DE] shadow-[0_2px_12px_rgba(0,0,0,0.02)] px-3 py-1.5 flex items-center justify-between sm:justify-start gap-3 hover:border-[#176B4D]/40 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#176B4D] text-white font-black text-xs flex items-center justify-center tracking-tight shrink-0 shadow-2xs">
                  {userInitials}
                </div>
                <div className="min-w-0 pr-1">
                  <p className="text-xs font-bold text-[#17231D] leading-tight truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-[#65736B] leading-tight capitalize">
                    {user.role === 'admin' ? 'Admin' : user.role}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#65736B] shrink-0" />
            </button>

            {/* Profile Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-[#DCE5DE] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#DCE5DE]">
                  <p className="text-xs font-bold text-[#17231D] truncate">{user.companyName}</p>
                  <p className="text-[10px] text-[#65736B] truncate">{user.email}</p>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8F3ED] text-[#176B4D] text-[10px] font-bold">
                    Plan {user.plan.toUpperCase()} • {trialDaysLeft}j essai
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#17231D] hover:bg-[#E8F3ED] flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#65736B]" />
                    Paramètres de l&apos;entreprise
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/subscription');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#17231D] hover:bg-[#E8F3ED] flex items-center gap-2 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#65736B]" />
                    Gérer mon abonnement
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#17231D] hover:bg-[#E8F3ED] flex items-center gap-2 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#65736B]" />
                    Site vitrine public
                  </button>
                </div>

                <div className="pt-1 border-t border-[#DCE5DE]">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ==============================================================
            PAGE BODY (DashboardOverview, Billing, Invoices, etc.)
           ============================================================== */}
        <main className="flex-1 w-full">{children}</main>
      </div>

      {/* Support / Contact Modal */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0E1A16]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setSupportModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#E8F4F0] text-[#0E7051] flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#0E1A16]">Support Client FAKTELIO</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Une question ou besoin d&apos;assistance sur votre compte ? Notre équipe basée en Côte d&apos;Ivoire et en Afrique de l&apos;Ouest vous répond sous 15 minutes.
            </p>
            <div className="space-y-2.5">
              <a
                href="https://wa.me/2250700000000?text=Bonjour%20FAKTELIO,%20j'ai%20besoin%20d'aide%20sur%20mon%20compte"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#0E5C44] hover:bg-[#0B4D39] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Discuter sur WhatsApp (+225)
              </a>
              <button
                onClick={() => {
                  setSupportModalOpen(false);
                  navigate('/reminders');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#0E1A16] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Voir les modèles de relance WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
