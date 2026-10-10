import React, { useState } from 'react';
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

import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { BillingView } from './components/billing/BillingView';
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
import { FastInvoiceModal } from './components/invoices/FastInvoiceModal';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';
import { LegalNoticePage } from './components/legal/LegalNoticePage';
import { PrivacyPolicyPage } from './components/legal/PrivacyPolicyPage';
import { CookiePolicyPage } from './components/legal/CookiePolicyPage';
import { FaktelioIntroLoader } from './components/intro/FaktelioIntroLoader';

function LandingPage() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-[#F7FAF8] text-[#10241D] selection:bg-[#215C46] selection:text-white">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <Features />
        <Benefits />
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

function AppRouter() {
  const { route, navigate } = useNavigation();
  const { user } = useAuth();
  const [fastInvoiceOpen, setFastInvoiceOpen] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const triggerRefresh = () => setRefreshCounter((c) => c + 1);

  if (route === '/') {
    return <LandingPage />;
  }

  if (route === '/login') {
    return <LoginPage />;
  }

  if (route === '/register') {
    return <RegisterPage />;
  }

  if (route === '/mentions-legales') {
    return <LegalNoticePage />;
  }

  if (route === '/politique-confidentialite') {
    return <PrivacyPolicyPage />;
  }

  if (route === '/politique-cookies') {
    return <CookiePolicyPage />;
  }

  // Protected SaaS routes
  if (!user) {
    return <LoginPage />;
  }

  return (
    <>
      <DashboardLayout onOpenFastInvoice={() => setFastInvoiceOpen(true)}>
        {route === '/dashboard' && (
          <DashboardOverview
            onOpenFastInvoice={() => setFastInvoiceOpen(true)}
            refreshKey={refreshCounter}
          />
        )}
        {route === '/billing' && <BillingView onSaved={triggerRefresh} />}
        {route === '/invoices' && (
          <InvoicesList
            refreshKey={refreshCounter}
            onOpenFastInvoice={() => setFastInvoiceOpen(true)}
          />
        )}
        {route === '/quotes' && (
          <QuotesList
            onConverted={() => {
              triggerRefresh();
              navigate('/invoices');
            }}
          />
        )}
        {route === '/clients' && <ClientsList />}
        {route === '/products' && <ProductsList />}
        {route === '/stock' && <StockList />}
        {route === '/payments' && <PaymentsList />}
        {route === '/reminders' && <RemindersList />}
        {route === '/reports' && <ReportsView />}
        {route === '/team' && <TeamView />}
        {route === '/subscription' && <SubscriptionView />}
        {route === '/settings' && <SettingsView />}
      </DashboardLayout>

      {fastInvoiceOpen && (
        <FastInvoiceModal
          onClose={() => setFastInvoiceOpen(false)}
          onCreated={() => {
            setFastInvoiceOpen(false);
            triggerRefresh();
          }}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <FaktelioIntroLoader />
        <AppRouter />
        <CookieConsentBanner />
        <PwaInstallPrompt />
      </NavigationProvider>
    </AuthProvider>
  );
}
