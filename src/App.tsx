import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';

// Landing Page Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Benefits } from './components/Benefits';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Audience } from './components/Audience';
import { Comparison } from './components/Comparison';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

// Auth Pages
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

// SaaS Dashboard & Modules
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { InvoicesList } from './components/invoices/InvoicesList';
import { QuotesList } from './components/quotes/QuotesList';
import { ClientsList } from './components/clients/ClientsList';
import { ProductsList } from './components/products/ProductsList';
import { StockList } from './components/stock/StockList';
import { PaymentsList } from './components/payments/PaymentsList';
import { RemindersList } from './components/reminders/RemindersList';
import { ReportsView } from './components/reports/ReportsView';
import { TeamView } from './components/team/TeamView';
import { SubscriptionView } from './components/subscription/SubscriptionView';
import { SettingsView } from './components/settings/SettingsView';

// Modals
import { FastInvoiceModal } from './components/invoices/FastInvoiceModal';
import { InvoiceDetailModal } from './components/invoices/InvoiceDetailModal';
import { QuoteModal } from './components/quotes/QuoteModal';
import { ClientModal } from './components/clients/ClientModal';
import { ProductModal } from './components/products/ProductModal';
import { PaymentModal } from './components/payments/PaymentModal';

import type { Invoice, Quote, Client, Product } from './types';

function MainRouter() {
  const { currentRoute, navigate } = useNavigation();
  const { currentUser, isLoading } = useAuth();

  // Modal States
  const [isFastInvoiceOpen, setIsFastInvoiceOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  // Scroll reveal observer for landing page
  useEffect(() => {
    if (currentRoute !== '/') return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in-view)'));
    if (elements.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [currentRoute]);

  // Loading indicator for auth check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#295294] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Chargement de Chapfacture...
          </p>
        </div>
      </div>
    );
  }

  // 1. PUBLIC LANDING PAGE
  if (currentRoute === '/') {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#f27a2c] selection:text-white">
        <Header />
        <main>
          <Hero />
          <Stats />
          <Benefits />
          <Features />
          <HowItWorks />
          <Audience />
          <Comparison />
          <Testimonials />
          <Pricing />
          <FAQ />
          <Contact />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    );
  }

  // 2. AUTH PAGES
  if (currentRoute === '/login') {
    return <LoginPage />;
  }

  if (currentRoute === '/register') {
    return <RegisterPage />;
  }

  // 3. PROTECTED SAAS ROUTES
  // If not authenticated, prompt login
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Espace Privé Sécurisé</h2>
            <p className="text-xs text-slate-500 mt-1">
              Vous devez être connecté à votre compte pour accéder à votre espace de facturation.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-[#295294] hover:bg-[#1e3e70] text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
            >
              Se connecter à mon compte
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors"
            >
              Créer mon compte gratuitement (14 jours offerts)
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard Layout with Active Module
  return (
    <DashboardLayout onOpenFastInvoice={() => setIsFastInvoiceOpen(true)}>
      {currentRoute === '/dashboard' && (
        <DashboardOverview
          onOpenFastInvoice={() => setIsFastInvoiceOpen(true)}
          onOpenNewClient={() => {
            setClientToEdit(null);
            setIsClientModalOpen(true);
          }}
          onOpenNewProduct={() => {
            setProductToEdit(null);
            setIsProductModalOpen(true);
          }}
          onViewInvoice={(invoice) => setSelectedInvoice(invoice)}
          onRecordPayment={(invoice) => setPaymentInvoice(invoice)}
        />
      )}

      {currentRoute === '/invoices' && (
        <InvoicesList
          onOpenFastInvoice={() => setIsFastInvoiceOpen(true)}
          onViewInvoice={(invoice) => setSelectedInvoice(invoice)}
          onRecordPayment={(invoice) => setPaymentInvoice(invoice)}
        />
      )}

      {currentRoute === '/quotes' && (
        <QuotesList
          onOpenNewQuote={() => setIsQuoteModalOpen(true)}
          onInvoiceCreated={(invoice) => setSelectedInvoice(invoice)}
        />
      )}

      {currentRoute === '/clients' && (
        <ClientsList
          onOpenNewClient={() => {
            setClientToEdit(null);
            setIsClientModalOpen(true);
          }}
          onEditClient={(c) => {
            setClientToEdit(c);
            setIsClientModalOpen(true);
          }}
          onViewInvoice={(invoice) => setSelectedInvoice(invoice)}
        />
      )}

      {currentRoute === '/products' && (
        <ProductsList
          onOpenNewProduct={() => {
            setProductToEdit(null);
            setIsProductModalOpen(true);
          }}
          onEditProduct={(p) => {
            setProductToEdit(p);
            setIsProductModalOpen(true);
          }}
          onNavigateStock={() => navigate('/stock')}
        />
      )}

      {currentRoute === '/stock' && <StockList />}

      {currentRoute === '/payments' && (
        <PaymentsList
          onOpenRecordPayment={() => setPaymentInvoice(null)}
          onViewInvoice={(invoice) => setSelectedInvoice(invoice)}
        />
      )}

      {currentRoute === '/reminders' && (
        <RemindersList onViewInvoice={(invoice) => setSelectedInvoice(invoice)} />
      )}

      {currentRoute === '/reports' && <ReportsView />}

      {currentRoute === '/team' && <TeamView />}

      {currentRoute === '/subscription' && <SubscriptionView />}

      {currentRoute === '/settings' && <SettingsView />}

      {/* GLOBAL MODALS */}
      <FastInvoiceModal
        isOpen={isFastInvoiceOpen}
        onClose={() => setIsFastInvoiceOpen(false)}
        onInvoiceCreated={(inv) => setSelectedInvoice(inv)}
        onOpenNewClient={() => {
          setClientToEdit(null);
          setIsClientModalOpen(true);
        }}
      />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        onQuoteCreated={() => setIsQuoteModalOpen(false)}
        onOpenNewClient={() => {
          setClientToEdit(null);
          setIsClientModalOpen(true);
        }}
      />

      <ClientModal
        isOpen={isClientModalOpen}
        clientToEdit={clientToEdit}
        onClose={() => {
          setIsClientModalOpen(false);
          setClientToEdit(null);
        }}
        onClientSaved={() => {
          setIsClientModalOpen(false);
          setClientToEdit(null);
        }}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        productToEdit={productToEdit}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        onProductSaved={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
      />

      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onRecordPayment={(inv) => {
          setSelectedInvoice(null);
          setPaymentInvoice(inv);
        }}
      />

      <PaymentModal
        isOpen={paymentInvoice !== null}
        invoice={paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        onPaymentRecorded={() => setPaymentInvoice(null)}
      />
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </NavigationProvider>
  );
}
