import {
  User,
  Company,
  CompanySettings,
  Client,
  Product,
  Category,
  StockMovement,
  Quote,
  Invoice,
  Payment,
  NotificationItem,
  TeamMember,
  Subscription,
  PlanType,
} from '../types';

const DB_KEYS = {
  CURRENT_USER: 'faktelio_current_user_v4',
  USERS: 'faktelio_users_v4',
  COMPANIES: 'faktelio_companies_v4',
  SETTINGS: 'faktelio_settings_v4',
  CLIENTS: 'faktelio_clients_v4',
  PRODUCTS: 'faktelio_products_v4',
  CATEGORIES: 'faktelio_categories_v4',
  STOCK_MOVEMENTS: 'faktelio_stock_movements_v4',
  QUOTES: 'faktelio_quotes_v4',
  INVOICES: 'faktelio_invoices_v4',
  PAYMENTS: 'faktelio_payments_v4',
  NOTIFICATIONS: 'faktelio_notifications_v4',
  TEAM: 'faktelio_team_v4',
  SUBSCRIPTIONS: 'faktelio_subscriptions_v4',
  CLEANSED_OLD_FAKES: 'faktelio_cleansed_fake_data_v4',
};

// Purge any legacy fake seeded data from previous app iterations
function purgeLegacyFakeData() {
  try {
    if (!localStorage.getItem(DB_KEYS.CLEANSED_OLD_FAKES)) {
      const legacyKeys = [
        'faktelio_current_user',
        'faktelio_users',
        'faktelio_settings',
        'faktelio_clients',
        'faktelio_products',
        'faktelio_stock_movements',
        'faktelio_quotes',
        'faktelio_invoices',
        'faktelio_payments',
        'faktelio_notifications',
        'faktelio_team',
        'faktelio_current_user_v3',
        'faktelio_users_v3',
        'faktelio_companies_v3',
        'faktelio_settings_v3',
        'faktelio_clients_v3',
        'faktelio_products_v3',
        'faktelio_categories_v3',
        'faktelio_stock_movements_v3',
        'faktelio_quotes_v3',
        'faktelio_invoices_v3',
        'faktelio_payments_v3',
        'faktelio_notifications_v3',
        'faktelio_team_v3',
        'faktelio_subscriptions_v3',
        'faktelio_cleansed_fake_data_v3',
        'chapfacture_current_user',
        'chapfacture_invoices',
        'chapfacture_clients',
      ];
      legacyKeys.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(DB_KEYS.CLEANSED_OLD_FAKES, 'true');
    }
  } catch {
    // Ignore storage access errors in restricted iframe
  }
}
purgeLegacyFakeData();

function getTable<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setTable<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export function formatFCFA(amount: number, currency = 'FCFA'): string {
  const rounded = Math.round(amount || 0);
  return `${rounded.toLocaleString('fr-FR')} ${currency}`;
}

export function formatDateFr(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Ensures strict company-level isolation.
 * Any input (whether userId or companyId) is canonically mapped to its companyId.
 */
export function resolveCompanyId(idOrCompanyId: string): string {
  if (!idOrCompanyId) return '';
  const users = getTable<User>(DB_KEYS.USERS);
  const found = users.find((u) => u.id === idOrCompanyId || u.companyId === idOrCompanyId);
  return found?.companyId || idOrCompanyId;
}

// ------------------------------------
// Authentication & Multi-Company DB
// ------------------------------------
export const authService = {
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(DB_KEYS.CURRENT_USER);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  register(data: {
    name: string;
    email: string;
    password?: string;
    companyName: string;
    phone: string;
    plan?: PlanType;
  }): { user?: User; error?: string } {
    const users = getTable<User & { password?: string }>(DB_KEYS.USERS);
    const normalized = data.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === normalized)) {
      return { error: 'Cette adresse email est déjà associée à un compte FAKTELIO.' };
    }

    const companyId = uid('comp');
    const userId = uid('usr');
    const plan = data.plan || 'startup';
    const companyName = data.companyName.trim() || `Entreprise ${data.name.trim()}`;

    // 1. Create Company
    const companies = getTable<Company>(DB_KEYS.COMPANIES);
    const newCompany: Company = {
      id: companyId,
      name: companyName,
      ownerId: userId,
      plan,
      trialEndsAt: Date.now() + 14 * 86400000,
      createdAt: Date.now(),
    };
    companies.push(newCompany);
    setTable(DB_KEYS.COMPANIES, companies);

    // 2. Create User
    const newUser: User & { password?: string } = {
      id: userId,
      companyId,
      name: data.name.trim(),
      email: normalized,
      password: data.password || '123456',
      companyName,
      phone: data.phone.trim() || '',
      role: 'admin',
      plan,
      trialEndsAt: Date.now() + 14 * 86400000,
      createdAt: Date.now(),
    };
    users.push(newUser);
    setTable(DB_KEYS.USERS, users);

    // 3. Create Default Company Settings (starts with 0 clients, 0 products, 0 invoices)
    const settingsList = getTable<CompanySettings>(DB_KEYS.SETTINGS);
    const initialSettings: CompanySettings = {
      companyId,
      name: companyName,
      accentColor: '#1E4F91',
      address: '',
      city: 'Abidjan',
      country: "Côte d'Ivoire",
      phone: data.phone.trim() || '',
      email: normalized,
      website: '',
      taxNumber: '',
      currency: 'FCFA',
      defaultVatRate: 18,
      invoicePrefix: 'FAC-2026-',
      quotePrefix: 'DEV-2026-',
      paymentTerms: 'Paiement à réception par Mobile Money ou virement.',
      signatureText: `Direction — ${companyName}`,
      bankDetails: '',
    };
    settingsList.push(initialSettings);
    setTable(DB_KEYS.SETTINGS, settingsList);

    // 4. Initial Team Member
    const team = getTable<TeamMember>(DB_KEYS.TEAM);
    team.push({
      id: uid('tm'),
      companyId,
      userId,
      name: newUser.name,
      email: newUser.email,
      role: 'admin',
      status: 'active',
      createdAt: Date.now(),
    });
    setTable(DB_KEYS.TEAM, team);

    // 5. Subscription
    const subs = getTable<Subscription>(DB_KEYS.SUBSCRIPTIONS);
    subs.push({
      id: uid('sub'),
      companyId,
      plan,
      status: 'trial',
      priceMonthly: plan === 'entreprise' ? 24900 : plan === 'startup' ? 9900 : 0,
      updatedAt: Date.now(),
    });
    setTable(DB_KEYS.SUBSCRIPTIONS, subs);

    // Set current active session
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return { user: newUser };
  },

  login(email: string, password?: string): { user?: User; error?: string } {
    const users = getTable<User & { password?: string }>(DB_KEYS.USERS);
    const normalized = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === normalized);

    if (!found) {
      return { error: 'Aucun compte trouvé avec cette adresse email. Veuillez créer votre compte pour démarrer.' };
    }

    if (password && found.password && found.password !== password) {
      return { error: 'Mot de passe incorrect.' };
    }

    if (!found.companyId) {
      found.companyId = found.id;
    }

    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(found));
    return { user: found };
  },

  loginDemo(): User {
    // Demo login creates a clean isolated test workspace with 0 fake data
    const demoEmail = 'demo@faktelio.com';
    const existing = this.login(demoEmail, 'demo');
    if (existing.user) return existing.user;

    const registered = this.register({
      name: 'Utilisateur Démo',
      email: demoEmail,
      password: 'demo',
      companyName: 'Mon Entreprise',
      phone: '',
      plan: 'startup',
    });
    return registered.user!;
  },

  updateUser(updated: Partial<User>): User | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    const merged: User = { ...current, ...updated };
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(merged));

    const users = getTable<User & { password?: string }>(DB_KEYS.USERS);
    const idx = users.findIndex((u) => u.id === current.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...merged };
      setTable(DB_KEYS.USERS, users);
    }
    return merged;
  },

  logout(): void {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  },
};

// ------------------------------------
// Data Workspace Operations (Strictly Isolated by Company)
// ------------------------------------
export const workspaceService = {
  // SETTINGS
  getSettings(companyOrUserId: string): CompanySettings {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<CompanySettings>(DB_KEYS.SETTINGS);
    const found = all.find((s) => s.companyId === cId || s.companyId === companyOrUserId);
    if (found) return found;

    const fallback: CompanySettings = {
      companyId: cId,
      name: 'Mon Entreprise',
      accentColor: '#1E4F91',
      address: '',
      city: 'Abidjan',
      country: "Côte d'Ivoire",
      phone: '',
      email: '',
      website: '',
      taxNumber: '',
      currency: 'FCFA',
      defaultVatRate: 18,
      invoicePrefix: 'FAC-2026-',
      quotePrefix: 'DEV-2026-',
      paymentTerms: 'Paiement à réception par Mobile Money ou virement.',
      signatureText: 'La Direction',
      bankDetails: '',
    };
    all.push(fallback);
    setTable(DB_KEYS.SETTINGS, all);
    return fallback;
  },

  saveSettings(companyOrUserId: string, settings: CompanySettings): CompanySettings {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<CompanySettings>(DB_KEYS.SETTINGS);
    const idx = all.findIndex((s) => s.companyId === cId || s.companyId === companyOrUserId);
    const updated = { ...settings, companyId: cId };
    if (idx !== -1) {
      all[idx] = updated;
    } else {
      all.push(updated);
    }
    setTable(DB_KEYS.SETTINGS, all);
    return updated;
  },

  // CLIENTS
  getClients(companyOrUserId: string): Client[] {
    const cId = resolveCompanyId(companyOrUserId);
    return getTable<Client>(DB_KEYS.CLIENTS)
      .filter((c) => c.companyId === cId || c.userId === cId || c.companyId === companyOrUserId || c.userId === companyOrUserId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  saveClient(
    companyOrUserId: string,
    clientData: Omit<Client, 'id' | 'companyId' | 'userId' | 'createdAt'> & { id?: string }
  ): Client {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<Client>(DB_KEYS.CLIENTS);
    if (clientData.id) {
      const idx = all.findIndex(
        (c) =>
          c.id === clientData.id &&
          (c.companyId === cId || c.userId === cId || c.companyId === companyOrUserId || c.userId === companyOrUserId)
      );
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...clientData, companyId: cId };
        setTable(DB_KEYS.CLIENTS, all);
        return all[idx];
      }
    }

    const newClient: Client = {
      id: uid('cli'),
      companyId: cId,
      userId: companyOrUserId,
      name: clientData.name.trim(),
      company: clientData.company?.trim() || '',
      email: clientData.email?.trim() || '',
      phone: clientData.phone?.trim() || '',
      address: clientData.address?.trim() || '',
      city: clientData.city?.trim() || 'Abidjan',
      country: clientData.country?.trim() || "Côte d'Ivoire",
      notes: clientData.notes?.trim() || '',
      createdAt: Date.now(),
    };
    all.push(newClient);
    setTable(DB_KEYS.CLIENTS, all);
    return newClient;
  },

  deleteClient(companyOrUserId: string, clientId: string): void {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<Client>(DB_KEYS.CLIENTS).filter(
      (c) =>
        !(
          c.id === clientId &&
          (c.companyId === cId || c.userId === cId || c.companyId === companyOrUserId || c.userId === companyOrUserId)
        )
    );
    setTable(DB_KEYS.CLIENTS, all);
  },

  importClients(companyOrUserId: string, imported: Array<Partial<Client>>): number {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<Client>(DB_KEYS.CLIENTS);
    let count = 0;
    for (const item of imported) {
      if (!item.name || !item.name.trim()) continue;
      all.push({
        id: uid('cli'),
        companyId: cId,
        userId: companyOrUserId,
        name: item.name.trim(),
        company: item.company?.trim() || '',
        email: item.email?.trim() || '',
        phone: item.phone?.trim() || '',
        address: item.address?.trim() || '',
        city: item.city?.trim() || 'Abidjan',
        country: item.country?.trim() || "Côte d'Ivoire",
        notes: item.notes?.trim() || '',
        createdAt: Date.now() - count * 1000,
      });
      count++;
    }
    setTable(DB_KEYS.CLIENTS, all);
    return count;
  },

  // PRODUCTS & SERVICES (CATALOGUE)
  getProducts(companyOrUserId: string): Product[] {
    const cId = resolveCompanyId(companyOrUserId);
    return getTable<Product>(DB_KEYS.PRODUCTS)
      .filter((p) => p.companyId === cId || p.userId === cId || p.companyId === companyOrUserId || p.userId === companyOrUserId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  saveProduct(
    companyOrUserId: string,
    productData: Omit<Product, 'id' | 'companyId' | 'userId' | 'createdAt'> & { id?: string }
  ): Product {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<Product>(DB_KEYS.PRODUCTS);
    if (productData.id) {
      const idx = all.findIndex(
        (p) =>
          p.id === productData.id &&
          (p.companyId === cId || p.userId === cId || p.companyId === companyOrUserId || p.userId === companyOrUserId)
      );
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...productData, companyId: cId };
        setTable(DB_KEYS.PRODUCTS, all);
        return all[idx];
      }
    }

    const newProduct: Product = {
      id: uid('prd'),
      companyId: cId,
      userId: companyOrUserId,
      type: productData.type,
      category: productData.category?.trim() || (productData.type === 'service' ? 'Prestations' : 'Matériel'),
      reference: productData.reference?.trim() || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      name: productData.name.trim(),
      description: productData.description?.trim() || '',
      unitPrice: Number(productData.unitPrice) || 0,
      vatRate: Number(productData.vatRate) || 0,
      unit: productData.unit || 'unité',
      stock: productData.type === 'service' ? 0 : Number(productData.stock) || 0,
      minStockAlert: productData.type === 'service' ? 0 : Number(productData.minStockAlert) || 0,
      createdAt: Date.now(),
    };
    all.push(newProduct);
    setTable(DB_KEYS.PRODUCTS, all);
    return newProduct;
  },

  duplicateProduct(companyOrUserId: string, productId: string): Product | null {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<Product>(DB_KEYS.PRODUCTS);
    const orig = all.find(
      (p) =>
        p.id === productId &&
        (p.companyId === cId || p.userId === cId || p.companyId === companyOrUserId || p.userId === companyOrUserId)
    );
    if (!orig) return null;
    const copy: Product = {
      ...orig,
      id: uid('prd'),
      companyId: cId,
      reference: `${orig.reference}-COPIE`,
      name: `${orig.name} (Copie)`,
      createdAt: Date.now(),
    };
    all.push(copy);
    setTable(DB_KEYS.PRODUCTS, all);
    return copy;
  },

  deleteProduct(companyOrUserId: string, productId: string): void {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<Product>(DB_KEYS.PRODUCTS).filter(
      (p) =>
        !(
          p.id === productId &&
          (p.companyId === cId || p.userId === cId || p.companyId === companyOrUserId || p.userId === companyOrUserId)
        )
    );
    setTable(DB_KEYS.PRODUCTS, all);
  },

  // STOCK MOVEMENTS
  getStockMovements(companyOrUserId: string): StockMovement[] {
    const cId = resolveCompanyId(companyOrUserId);
    return getTable<StockMovement>(DB_KEYS.STOCK_MOVEMENTS)
      .filter((m) => m.companyId === cId || m.userId === cId || m.companyId === companyOrUserId || m.userId === companyOrUserId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  adjustStock(
    companyOrUserId: string,
    productId: string,
    type: 'in' | 'out',
    quantity: number,
    reason: string
  ): StockMovement | null {
    const cId = resolveCompanyId(companyOrUserId);
    const products = getTable<Product>(DB_KEYS.PRODUCTS);
    const idx = products.findIndex(
      (p) =>
        p.id === productId &&
        (p.companyId === cId || p.userId === cId || p.companyId === companyOrUserId || p.userId === companyOrUserId)
    );
    if (idx === -1) return null;

    const product = products[idx];
    if (product.type === 'service') return null;

    const previousStock = Number(product.stock) || 0;
    const delta = type === 'in' ? Math.abs(quantity) : -Math.abs(quantity);
    const newStock = Math.max(0, previousStock + delta);
    products[idx].stock = newStock;
    setTable(DB_KEYS.PRODUCTS, products);

    const movements = getTable<StockMovement>(DB_KEYS.STOCK_MOVEMENTS);
    const movement: StockMovement = {
      id: uid('mov'),
      companyId: cId,
      userId: companyOrUserId,
      productId: product.id,
      productName: product.name,
      productReference: product.reference,
      type,
      quantity: Math.abs(quantity),
      previousStock,
      newStock,
      reason: reason || (type === 'in' ? 'Entrée manuelle en stock' : 'Sortie manuelle de stock'),
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    };
    movements.push(movement);
    setTable(DB_KEYS.STOCK_MOVEMENTS, movements);
    return movement;
  },

  // QUOTES (DEVIS)
  getQuotes(companyOrUserId: string): Quote[] {
    const cId = resolveCompanyId(companyOrUserId);
    return getTable<Quote>(DB_KEYS.QUOTES)
      .filter((q) => q.companyId === cId || q.userId === cId || q.companyId === companyOrUserId || q.userId === companyOrUserId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  getNextQuoteNumber(companyOrUserId: string): string {
    const settings = this.getSettings(companyOrUserId);
    const quotes = this.getQuotes(companyOrUserId);
    const prefix = settings.quotePrefix || 'DEV-2026-';
    let maxNum = 0;
    quotes.forEach((q) => {
      if (q.number && q.number.startsWith(prefix)) {
        const numPart = parseInt(q.number.replace(prefix, ''), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });
    return `${prefix}${String(maxNum + 1).padStart(4, '0')}`;
  },

  saveQuote(
    companyOrUserId: string,
    quoteData: Omit<Quote, 'id' | 'companyId' | 'userId' | 'createdAt'> & { id?: string }
  ): Quote {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<Quote>(DB_KEYS.QUOTES);
    if (quoteData.id) {
      const idx = all.findIndex(
        (q) =>
          q.id === quoteData.id &&
          (q.companyId === cId || q.userId === cId || q.companyId === companyOrUserId || q.userId === companyOrUserId)
      );
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...quoteData, companyId: cId };
        setTable(DB_KEYS.QUOTES, all);
        return all[idx];
      }
    }

    const newQuote: Quote = {
      ...quoteData,
      id: uid('quo'),
      companyId: cId,
      userId: companyOrUserId,
      createdAt: Date.now(),
    };
    all.push(newQuote);
    setTable(DB_KEYS.QUOTES, all);
    return newQuote;
  },

  deleteQuote(companyOrUserId: string, quoteId: string): void {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<Quote>(DB_KEYS.QUOTES).filter(
      (q) =>
        !(
          q.id === quoteId &&
          (q.companyId === cId || q.userId === cId || q.companyId === companyOrUserId || q.userId === companyOrUserId)
        )
    );
    setTable(DB_KEYS.QUOTES, all);
  },

  convertQuoteToInvoice(companyOrUserId: string, quoteId: string): Invoice | null {
    const cId = resolveCompanyId(companyOrUserId);
    const allQuotes = getTable<Quote>(DB_KEYS.QUOTES);
    const qIdx = allQuotes.findIndex(
      (q) =>
        q.id === quoteId &&
        (q.companyId === cId || q.userId === cId || q.companyId === companyOrUserId || q.userId === companyOrUserId)
    );
    if (qIdx === -1) return null;

    const quote = allQuotes[qIdx];
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];

    const invoice = this.saveInvoice(cId, {
      number: this.getNextInvoiceNumber(cId),
      quoteId: quote.id,
      clientId: quote.clientId,
      clientName: quote.clientName,
      clientEmail: quote.clientEmail,
      clientPhone: quote.clientPhone,
      clientCompany: quote.clientCompany,
      clientAddress: quote.clientAddress,
      issueDate: today,
      dueDate: due,
      items: quote.items,
      subtotalHt: quote.subtotalHt,
      totalVat: quote.totalVat,
      discountRate: quote.discountRate,
      totalTtc: quote.totalTtc,
      paidAmount: 0,
      remainingAmount: quote.totalTtc,
      status: 'sent',
      notes: quote.notes || `Facture générée depuis le devis ${quote.number}`,
      terms: quote.terms,
    });

    allQuotes[qIdx].status = 'accepted';
    allQuotes[qIdx].convertedToInvoiceId = invoice.id;
    setTable(DB_KEYS.QUOTES, allQuotes);
    return invoice;
  },

  // INVOICES (FACTURES)
  getInvoices(companyOrUserId: string): Invoice[] {
    const cId = resolveCompanyId(companyOrUserId);
    const today = new Date().toISOString().split('T')[0];

    return getTable<Invoice>(DB_KEYS.INVOICES)
      .filter((i) => i.companyId === cId || i.userId === cId || i.companyId === companyOrUserId || i.userId === companyOrUserId)
      .map((inv) => {
        // Compute dynamically exact status based on real payments and due date
        let status = inv.status;
        const total = Number(inv.totalTtc) || 0;
        const paid = Number(inv.paidAmount) || 0;
        const remaining = Math.max(0, total - paid);

        if (status !== 'draft') {
          if (remaining === 0 && total > 0) {
            status = 'paid';
          } else if (paid > 0 && remaining > 0) {
            status = 'partial';
          } else if (inv.dueDate && inv.dueDate < today && remaining > 0) {
            status = 'late';
          } else {
            status = 'sent';
          }
        }
        return {
          ...inv,
          remainingAmount: remaining,
          status,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  getNextInvoiceNumber(companyOrUserId: string): string {
    const settings = this.getSettings(companyOrUserId);
    const invoices = this.getInvoices(companyOrUserId);
    const prefix = settings.invoicePrefix || 'FAC-2026-';
    let maxNum = 0;
    invoices.forEach((i) => {
      if (i.number && i.number.startsWith(prefix)) {
        const numPart = parseInt(i.number.replace(prefix, ''), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });
    return `${prefix}${String(maxNum + 1).padStart(4, '0')}`;
  },

  saveInvoice(
    companyOrUserId: string,
    invoiceData: Omit<Invoice, 'id' | 'companyId' | 'userId' | 'createdAt'> & { id?: string }
  ): Invoice {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<Invoice>(DB_KEYS.INVOICES);
    const isNew = !invoiceData.id;

    if (invoiceData.id) {
      const idx = all.findIndex(
        (i) =>
          i.id === invoiceData.id &&
          (i.companyId === cId || i.userId === cId || i.companyId === companyOrUserId || i.userId === companyOrUserId)
      );
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...invoiceData, companyId: cId };
        setTable(DB_KEYS.INVOICES, all);
        return all[idx];
      }
    }

    const newInvoice: Invoice = {
      ...invoiceData,
      id: uid('inv'),
      companyId: cId,
      userId: companyOrUserId,
      createdAt: Date.now(),
    };
    all.push(newInvoice);
    setTable(DB_KEYS.INVOICES, all);

    // If new valid invoice (non-draft), automatically deduct physical product stock
    if (isNew && newInvoice.status !== 'draft') {
      newInvoice.items.forEach((item) => {
        if (item.productId) {
          this.adjustStock(
            cId,
            item.productId,
            'out',
            item.quantity,
            `Facture ${newInvoice.number} — ${newInvoice.clientName}`
          );
        }
      });
    }

    // If created with initial paidAmount > 0, record real payment in payments journal
    if (isNew && newInvoice.paidAmount > 0) {
      const payments = getTable<Payment>(DB_KEYS.PAYMENTS);
      payments.push({
        id: uid('pay'),
        companyId: cId,
        userId: companyOrUserId,
        invoiceId: newInvoice.id,
        invoiceNumber: newInvoice.number,
        clientId: newInvoice.clientId,
        clientName: newInvoice.clientName,
        amount: newInvoice.paidAmount,
        paymentMethod: (newInvoice.paymentMethod as any) || 'mobile_money',
        reference: `REG-${newInvoice.number}`,
        notes: 'Paiement comptant initial à la facturation',
        paidAt: newInvoice.issueDate,
        createdAt: Date.now(),
      });
      setTable(DB_KEYS.PAYMENTS, payments);
    }

    return newInvoice;
  },

  deleteInvoice(companyOrUserId: string, invoiceId: string): void {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<Invoice>(DB_KEYS.INVOICES);
    const target = all.find(
      (i) =>
        i.id === invoiceId &&
        (i.companyId === cId || i.userId === cId || i.companyId === companyOrUserId || i.userId === companyOrUserId)
    );
    if (!target) return;

    // Restore stock if it was deducted
    if (target.status !== 'draft') {
      target.items.forEach((item) => {
        if (item.productId) {
          this.adjustStock(
            cId,
            item.productId,
            'in',
            item.quantity,
            `Annulation / Suppression Facture ${target.number}`
          );
        }
      });
    }

    // Delete invoice
    setTable(
      DB_KEYS.INVOICES,
      all.filter((i) => i.id !== invoiceId)
    );

    // Delete associated payments
    const payments = getTable<Payment>(DB_KEYS.PAYMENTS).filter((p) => p.invoiceId !== invoiceId);
    setTable(DB_KEYS.PAYMENTS, payments);
  },

  // PAYMENTS (PAIEMENTS)
  getPayments(companyOrUserId: string): Payment[] {
    const cId = resolveCompanyId(companyOrUserId);
    return getTable<Payment>(DB_KEYS.PAYMENTS)
      .filter((p) => p.companyId === cId || p.userId === cId || p.companyId === companyOrUserId || p.userId === companyOrUserId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  recordPayment(
    companyOrUserId: string,
    data: {
      invoiceId: string;
      amount: number;
      paymentMethod: Payment['paymentMethod'];
      reference?: string;
      notes?: string;
      paidAt: string;
    }
  ): Payment | null {
    const cId = resolveCompanyId(companyOrUserId);
    const invoices = getTable<Invoice>(DB_KEYS.INVOICES);
    const idx = invoices.findIndex(
      (i) =>
        i.id === data.invoiceId &&
        (i.companyId === cId || i.userId === cId || i.companyId === companyOrUserId || i.userId === companyOrUserId)
    );
    if (idx === -1) return null;

    const inv = invoices[idx];
    const cleanAmount = Math.min(Number(data.amount) || 0, inv.remainingAmount || inv.totalTtc);
    if (cleanAmount <= 0) return null;

    inv.paidAmount = (inv.paidAmount || 0) + cleanAmount;
    inv.remainingAmount = Math.max(0, inv.totalTtc - inv.paidAmount);
    inv.status = inv.remainingAmount === 0 ? 'paid' : 'partial';
    invoices[idx] = inv;
    setTable(DB_KEYS.INVOICES, invoices);

    const payments = getTable<Payment>(DB_KEYS.PAYMENTS);
    const payment: Payment = {
      id: uid('pay'),
      companyId: cId,
      userId: companyOrUserId,
      invoiceId: inv.id,
      invoiceNumber: inv.number,
      clientId: inv.clientId,
      clientName: inv.clientName,
      amount: cleanAmount,
      paymentMethod: data.paymentMethod,
      reference: data.reference || `PAY-${Math.floor(10000 + Math.random() * 90000)}`,
      notes: data.notes,
      paidAt: data.paidAt || new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    };
    payments.push(payment);
    setTable(DB_KEYS.PAYMENTS, payments);

    return payment;
  },

  // NOTIFICATIONS
  getNotifications(companyOrUserId: string): NotificationItem[] {
    const cId = resolveCompanyId(companyOrUserId);
    return getTable<NotificationItem>(DB_KEYS.NOTIFICATIONS)
      .filter((n) => n.companyId === cId || n.userId === cId || n.companyId === companyOrUserId || n.userId === companyOrUserId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  addNotification(
    companyOrUserId: string,
    data: Omit<NotificationItem, 'id' | 'companyId' | 'userId' | 'read' | 'createdAt'>
  ): NotificationItem {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<NotificationItem>(DB_KEYS.NOTIFICATIONS);
    const item: NotificationItem = {
      id: uid('notif'),
      companyId: cId,
      userId: companyOrUserId,
      ...data,
      read: false,
      createdAt: Date.now(),
    };
    all.push(item);
    setTable(DB_KEYS.NOTIFICATIONS, all);
    return item;
  },

  markAllNotificationsRead(companyOrUserId: string): void {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<NotificationItem>(DB_KEYS.NOTIFICATIONS).map((n) =>
      n.companyId === cId || n.userId === cId || n.companyId === companyOrUserId || n.userId === companyOrUserId
        ? { ...n, read: true }
        : n
    );
    setTable(DB_KEYS.NOTIFICATIONS, all);
  },

  // TEAM
  getTeam(companyOrUserId: string): TeamMember[] {
    const cId = resolveCompanyId(companyOrUserId);
    return getTable<TeamMember>(DB_KEYS.TEAM).filter(
      (t) => t.companyId === cId || t.userId === cId || t.companyId === companyOrUserId || t.userId === companyOrUserId
    );
  },

  addTeamMember(
    companyOrUserId: string,
    data: { name: string; email: string; role: TeamMember['role'] }
  ): TeamMember {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<TeamMember>(DB_KEYS.TEAM);
    const member: TeamMember = {
      id: uid('tm'),
      companyId: cId,
      userId: companyOrUserId,
      name: data.name.trim(),
      email: data.email.trim(),
      role: data.role,
      status: 'active',
      createdAt: Date.now(),
    };
    all.push(member);
    setTable(DB_KEYS.TEAM, all);
    return member;
  },

  updateTeamMemberRole(
    companyOrUserId: string,
    memberId: string,
    newRole: TeamMember['role']
  ): TeamMember | null {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<TeamMember>(DB_KEYS.TEAM);
    const idx = all.findIndex(
      (t) =>
        t.id === memberId &&
        (t.companyId === cId || t.userId === cId || t.companyId === companyOrUserId || t.userId === companyOrUserId)
    );
    if (idx === -1) return null;
    all[idx].role = newRole;
    setTable(DB_KEYS.TEAM, all);
    return all[idx];
  },

  removeTeamMember(companyOrUserId: string, memberId: string): void {
    const cId = resolveCompanyId(companyOrUserId);
    const all = getTable<TeamMember>(DB_KEYS.TEAM).filter(
      (t) =>
        !(
          t.id === memberId &&
          (t.companyId === cId || t.userId === cId || t.companyId === companyOrUserId || t.userId === companyOrUserId)
        )
    );
    setTable(DB_KEYS.TEAM, all);
  },
};

// Aliases for compatibility
export const invoicesStorage = workspaceService;
export const clientsStorage = workspaceService;
export const productsStorage = workspaceService;
