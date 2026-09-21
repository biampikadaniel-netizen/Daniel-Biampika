export interface NavItem {
  label: string;
  href: string;
}

export interface PricingPlan {
  id: 'free' | 'pro' | 'business';
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  badge?: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  initials: string;
  name: string;
  role: string;
  city: string;
  gradient: string;
}

export interface ComparisonRow {
  feature: string;
  traditional: string;
  chapfacture: string;
}

// ------------------------------------
// SaaS Application Domain Models
// ------------------------------------

export type PlanType = 'basique' | 'startup' | 'entreprise';

export interface User {
  id: string;
  name: string;
  email: string;
  companyName: string;
  phone: string;
  role: 'admin' | 'manager' | 'collaborator';
  plan: PlanType;
  trialEndsAt: number; // timestamp in ms (14 days from registration)
  createdAt: number;
  avatarUrl?: string;
}

export interface CompanySettings {
  name: string;
  logoUrl?: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  taxNumber?: string; // NIF / RCCM
  currency: string; // default: 'FCFA'
  defaultVatRate: number; // default: 18%
  invoicePrefix: string; // default: 'FAC-'
  quotePrefix: string; // default: 'DEV-'
  paymentTerms: string; // default: 'Paiement à réception ou sous 15 jours'
  stampUrl?: string; // Cachet / signature
  bankDetails?: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  company?: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  notes?: string;
  createdAt: number;
}

export interface Product {
  id: string;
  userId: string;
  type: 'product' | 'service';
  reference: string;
  name: string;
  description?: string;
  unitPrice: number; // in FCFA
  vatRate: number; // 0, 18, etc.
  unit: string; // 'unité', 'heure', 'jour', 'forfait', 'lot'
  stock: number;
  minStockAlert: number;
  createdAt: number;
}

export interface LineItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  totalHt: number;
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface Quote {
  id: string;
  userId: string;
  number: string; // e.g. DEV-2026-001
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  clientAddress?: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  items: LineItem[];
  subtotalHt: number;
  totalVat: number;
  discountRate: number; // percent
  totalTtc: number;
  status: QuoteStatus;
  notes?: string;
  terms?: string;
  convertedToInvoiceId?: string;
  createdAt: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'late';

export interface Invoice {
  id: string;
  userId: string;
  number: string; // e.g. FAC-2026-001
  quoteId?: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  clientAddress?: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  items: LineItem[];
  subtotalHt: number;
  totalVat: number;
  discountRate: number; // percent
  totalTtc: number;
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
  notes?: string;
  terms?: string;
  paymentMethod?: string;
  createdAt: number;
}

export type PaymentMethod = 'cash' | 'mobile_money' | 'bank_transfer' | 'card' | 'other';

export interface Payment {
  id: string;
  userId: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  notes?: string;
  paidAt: string; // YYYY-MM-DD
  createdAt: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'payment' | 'invoice' | 'quote' | 'stock' | 'trial' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'collaborator';
  status: 'active' | 'invited';
  createdAt: number;
}
