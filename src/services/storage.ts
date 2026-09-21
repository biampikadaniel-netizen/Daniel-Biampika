import type {
  User,
  CompanySettings,
  Client,
  Product,
  Quote,
  Invoice,
  Payment,
  NotificationItem,
  TeamMember,
  PlanType,
} from '../types';

// Storage keys
const USERS_KEY = 'chapfacture_users_v1';
const SESSION_KEY = 'chapfacture_session_v1';
const CLIENTS_KEY = 'chapfacture_clients_v1';
const PRODUCTS_KEY = 'chapfacture_products_v1';
const QUOTES_KEY = 'chapfacture_quotes_v1';
const INVOICES_KEY = 'chapfacture_invoices_v1';
const PAYMENTS_KEY = 'chapfacture_payments_v1';
const NOTIFICATIONS_KEY = 'chapfacture_notifications_v1';
const TEAM_KEY = 'chapfacture_team_v1';
const SETTINGS_KEY = 'chapfacture_settings_v1';

// Helper to get array from localStorage
function getList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return [];
  }
}

// Helper to save array to localStorage
function saveList<T>(key: string, list: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// -------------------------------------------------------------
// Authentication & User Accounts (Multi-user with password check)
// -------------------------------------------------------------

interface StoredUserAccount {
  user: User;
  passwordHash: string;
}

export const authStorage = {
  getUsers(): StoredUserAccount[] {
    return getList<StoredUserAccount>(USERS_KEY);
  },

  register(data: {
    name: string;
    email: string;
    companyName: string;
    phone: string;
    password: string;
  }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanEmail = data.email.trim().toLowerCase();

    if (users.some((u) => u.user.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Un compte avec cette adresse email existe déjà.' };
    }

    const userId = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const now = Date.now();
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

    const newUser: User = {
      id: userId,
      name: data.name.trim(),
      email: cleanEmail,
      companyName: data.companyName.trim(),
      phone: data.phone.trim(),
      role: 'admin',
      plan: 'entreprise', // 14-day free trial on Entreprise
      trialEndsAt: now + fourteenDaysMs,
      createdAt: now,
    };

    users.push({
      user: newUser,
      passwordHash: btoa(data.password), // simple reversible encoded hash for client session verification
    });
    saveList(USERS_KEY, users);

    // Initialize default company settings
    const defaultSettings: CompanySettings = {
      name: data.companyName.trim(),
      address: 'Abidjan, Côte d’Ivoire',
      city: 'Abidjan',
      country: 'Côte d’Ivoire',
      phone: data.phone.trim(),
      email: cleanEmail,
      currency: 'FCFA',
      defaultVatRate: 18,
      invoicePrefix: 'FAC-',
      quotePrefix: 'DEV-',
      paymentTerms: 'Paiement sous 15 jours dès réception',
    };
    settingsStorage.saveSettings(userId, defaultSettings);

    // Initial welcome notification
    notificationsStorage.addNotification({
      userId,
      type: 'trial',
      title: 'Bienvenue sur Chapfacture ! 🎉',
      message:
        'Votre essai gratuit de 14 jours à l’offre Entreprise est actif. Créez vos premiers clients et factures en toute liberté.',
      read: false,
    });

    // Automatically set session
    this.createSession(newUser);

    return { success: true, user: newUser };
  },

  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const record = users.find((u) => u.user.email.toLowerCase() === cleanEmail);

    if (!record) {
      return { success: false, error: 'Identifiants incorrects ou compte introuvable.' };
    }

    if (record.passwordHash !== btoa(password)) {
      return { success: false, error: 'Mot de passe incorrect.' };
    }

    this.createSession(record.user);
    return { success: true, user: record.user };
  },

  createSession(user: User): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, savedAt: Date.now() }));
    } catch (e) {
      console.error('Session write error', e);
    }
  },

  getCurrentUser(): User | null {
    try {
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (!rawSession) return null;
      const { userId } = JSON.parse(rawSession);
      const users = this.getUsers();
      const match = users.find((u) => u.user.id === userId);
      return match ? match.user : null;
    } catch (e) {
      return null;
    }
  },

  logout(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error('Logout error', e);
    }
  },

  updateUserProfile(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.user.id === userId);
    if (index === -1) return null;

    users[index].user = { ...users[index].user, ...updates };
    saveList(USERS_KEY, users);
    return users[index].user;
  },

  changePassword(userId: string, oldPass: string, newPass: string): { success: boolean; error?: string } {
    const users = this.getUsers();
    const record = users.find((u) => u.user.id === userId);
    if (!record) return { success: false, error: 'Utilisateur non trouvé' };

    if (record.passwordHash !== btoa(oldPass)) {
      return { success: false, error: 'Le mot de passe actuel est incorrect.' };
    }

    record.passwordHash = btoa(newPass);
    saveList(USERS_KEY, users);
    return { success: true };
  },

  resetPasswordByEmail(email: string): { success: boolean; message: string } {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const record = users.find((u) => u.user.email.toLowerCase() === cleanEmail);

    if (!record) {
      return {
        success: false,
        message: 'Aucun compte associé à cette adresse e-mail n’a été trouvé.',
      };
    }

    // Generate simulated recovery token / reset password to default "Chap1234!"
    record.passwordHash = btoa('Chap1234!');
    saveList(USERS_KEY, users);

    return {
      success: true,
      message: 'Un mot de passe temporaire a été réinitialisé à "Chap1234!". Vous pouvez vous connecter et le changer dans Paramètres.',
    };
  },
};

// -------------------------------------------------------------
// Settings Storage
// -------------------------------------------------------------
export const settingsStorage = {
  getSettings(userId: string): CompanySettings {
    const all = getList<{ userId: string; settings: CompanySettings }>(SETTINGS_KEY);
    const found = all.find((item) => item.userId === userId);
    if (found) return found.settings;

    const user = authStorage.getCurrentUser();
    return {
      name: user?.companyName || 'Mon Entreprise',
      address: 'Abidjan, Côte d’Ivoire',
      city: 'Abidjan',
      country: 'Côte d’Ivoire',
      phone: user?.phone || '+225 07 00 00 00 00',
      email: user?.email || 'contact@monentreprise.com',
      currency: 'FCFA',
      defaultVatRate: 18,
      invoicePrefix: 'FAC-',
      quotePrefix: 'DEV-',
      paymentTerms: 'Paiement sous 15 jours dès réception',
    };
  },

  saveSettings(userId: string, settings: CompanySettings): void {
    const all = getList<{ userId: string; settings: CompanySettings }>(SETTINGS_KEY);
    const index = all.findIndex((item) => item.userId === userId);
    if (index >= 0) {
      all[index].settings = settings;
    } else {
      all.push({ userId, settings });
    }
    saveList(SETTINGS_KEY, all);
  },

  updateSettings(userId: string, updates: Partial<CompanySettings>): CompanySettings {
    const current = this.getSettings(userId);
    const updated = { ...current, ...updates };
    this.saveSettings(userId, updated);
    return updated;
  },
};

// -------------------------------------------------------------
// Clients Storage (Isolated by userId)
// -------------------------------------------------------------
export const clientsStorage = {
  getAll(userId: string): Client[] {
    const list = getList<Client>(CLIENTS_KEY);
    return list.filter((c) => c.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  },

  getById(userId: string, id: string): Client | undefined {
    return this.getAll(userId).find((c) => c.id === id);
  },

  add(userId: string, clientData: Omit<Client, 'id' | 'userId' | 'createdAt'>): Client {
    const all = getList<Client>(CLIENTS_KEY);
    const newClient: Client = {
      ...clientData,
      id: 'cli_' + Math.random().toString(36).substring(2, 9),
      userId,
      createdAt: Date.now(),
    };
    all.push(newClient);
    saveList(CLIENTS_KEY, all);

    notificationsStorage.addNotification({
      userId,
      type: 'system',
      title: 'Nouveau client ajouté',
      message: `Le client ${newClient.name} a été enregistré avec succès.`,
      read: false,
    });

    return newClient;
  },

  update(userId: string, id: string, updates: Partial<Client>): Client | null {
    const all = getList<Client>(CLIENTS_KEY);
    const index = all.findIndex((c) => c.id === id && c.userId === userId);
    if (index === -1) return null;

    all[index] = { ...all[index], ...updates };
    saveList(CLIENTS_KEY, all);
    return all[index];
  },

  delete(userId: string, id: string): boolean {
    const all = getList<Client>(CLIENTS_KEY);
    const filtered = all.filter((c) => !(c.id === id && c.userId === userId));
    saveList(CLIENTS_KEY, filtered);
    return true;
  },
};

// -------------------------------------------------------------
// Products & Services Storage (Isolated by userId)
// -------------------------------------------------------------
export const productsStorage = {
  getAll(userId: string): Product[] {
    const list = getList<Product>(PRODUCTS_KEY);
    return list.filter((p) => p.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  },

  getById(userId: string, id: string): Product | undefined {
    return this.getAll(userId).find((p) => p.id === id);
  },

  add(userId: string, productData: Omit<Product, 'id' | 'userId' | 'createdAt'>): Product {
    const all = getList<Product>(PRODUCTS_KEY);
    const newProduct: Product = {
      ...productData,
      id: 'prd_' + Math.random().toString(36).substring(2, 9),
      userId,
      createdAt: Date.now(),
    };
    all.push(newProduct);
    saveList(PRODUCTS_KEY, all);
    return newProduct;
  },

  update(userId: string, id: string, updates: Partial<Product>): Product | null {
    const all = getList<Product>(PRODUCTS_KEY);
    const index = all.findIndex((p) => p.id === id && p.userId === userId);
    if (index === -1) return null;

    all[index] = { ...all[index], ...updates };
    saveList(PRODUCTS_KEY, all);
    return all[index];
  },

  adjustStock(userId: string, id: string, delta: number, reason?: string): Product | null {
    const product = this.getById(userId, id);
    if (!product) return null;

    const newStock = Math.max(0, (product.stock || 0) + delta);
    const updated = this.update(userId, id, { stock: newStock });

    if (updated && updated.type === 'product' && newStock <= updated.minStockAlert) {
      notificationsStorage.addNotification({
        userId,
        type: 'stock',
        title: 'Alerte stock faible ! ⚠️',
        message: `Le stock de « ${updated.name} » est maintenant à ${newStock} (seuil d'alerte : ${updated.minStockAlert}).`,
        read: false,
      });
    }

    return updated;
  },

  delete(userId: string, id: string): boolean {
    const all = getList<Product>(PRODUCTS_KEY);
    const filtered = all.filter((p) => !(p.id === id && p.userId === userId));
    saveList(PRODUCTS_KEY, filtered);
    return true;
  },
};

// -------------------------------------------------------------
// Quotes Storage (Isolated by userId)
// -------------------------------------------------------------
export const quotesStorage = {
  getAll(userId: string): Quote[] {
    const list = getList<Quote>(QUOTES_KEY);
    return list.filter((q) => q.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  },

  getById(userId: string, id: string): Quote | undefined {
    return this.getAll(userId).find((q) => q.id === id);
  },

  getNextNumber(userId: string): string {
    const quotes = this.getAll(userId);
    const count = quotes.length + 1;
    const settings = settingsStorage.getSettings(userId);
    const prefix = settings.quotePrefix || 'DEV-';
    const year = new Date().getFullYear();
    return `${prefix}${year}-${String(count).padStart(3, '0')}`;
  },

  add(userId: string, data: Omit<Quote, 'id' | 'userId' | 'createdAt'>): Quote {
    const all = getList<Quote>(QUOTES_KEY);
    const newQuote: Quote = {
      ...data,
      id: 'dev_' + Math.random().toString(36).substring(2, 9),
      userId,
      createdAt: Date.now(),
    };
    all.push(newQuote);
    saveList(QUOTES_KEY, all);

    notificationsStorage.addNotification({
      userId,
      type: 'quote',
      title: `Devis ${newQuote.number} créé`,
      message: `Devis de ${newQuote.totalTtc.toLocaleString('fr-FR')} FCFA pour ${newQuote.clientName}.`,
      read: false,
    });

    return newQuote;
  },

  update(userId: string, id: string, updates: Partial<Quote>): Quote | null {
    const all = getList<Quote>(QUOTES_KEY);
    const index = all.findIndex((q) => q.id === id && q.userId === userId);
    if (index === -1) return null;

    all[index] = { ...all[index], ...updates };
    saveList(QUOTES_KEY, all);
    return all[index];
  },

  delete(userId: string, id: string): boolean {
    const all = getList<Quote>(QUOTES_KEY);
    const filtered = all.filter((q) => !(q.id === id && q.userId === userId));
    saveList(QUOTES_KEY, filtered);
    return true;
  },

  /**
   * 1-Click: "Transformer le devis en facture"
   */
  convertToInvoice(userId: string, quoteId: string): Invoice | null {
    const quote = this.getById(userId, quoteId);
    if (!quote) return null;

    // Create corresponding invoice
    const invoiceNumber = invoicesStorage.getNextNumber(userId);
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newInvoice = invoicesStorage.add(userId, {
      number: invoiceNumber,
      quoteId: quote.id,
      clientId: quote.clientId,
      clientName: quote.clientName,
      clientEmail: quote.clientEmail,
      clientPhone: quote.clientPhone,
      clientCompany: quote.clientCompany,
      clientAddress: quote.clientAddress,
      issueDate: today,
      dueDate,
      items: quote.items,
      subtotalHt: quote.subtotalHt,
      totalVat: quote.totalVat,
      discountRate: quote.discountRate,
      totalTtc: quote.totalTtc,
      paidAmount: 0,
      remainingAmount: quote.totalTtc,
      status: 'sent',
      notes: quote.notes,
      terms: quote.terms,
    });

    // Mark quote as accepted & reference invoice
    this.update(userId, quoteId, {
      status: 'accepted',
      convertedToInvoiceId: newInvoice.id,
    });

    notificationsStorage.addNotification({
      userId,
      type: 'quote',
      title: 'Devis converti en facture ! 🚀',
      message: `Le devis ${quote.number} est maintenant la facture ${newInvoice.number}.`,
      read: false,
    });

    return newInvoice;
  },
};

// -------------------------------------------------------------
// Invoices Storage (Isolated by userId)
// -------------------------------------------------------------
export const invoicesStorage = {
  getAll(userId: string): Invoice[] {
    const list = getList<Invoice>(INVOICES_KEY);
    return list.filter((inv) => inv.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  },

  getById(userId: string, id: string): Invoice | undefined {
    return this.getAll(userId).find((inv) => inv.id === id);
  },

  getNextNumber(userId: string): string {
    const invoices = this.getAll(userId);
    const count = invoices.length + 1;
    const settings = settingsStorage.getSettings(userId);
    const prefix = settings.invoicePrefix || 'FAC-';
    const year = new Date().getFullYear();
    return `${prefix}${year}-${String(count).padStart(3, '0')}`;
  },

  add(userId: string, data: Omit<Invoice, 'id' | 'userId' | 'createdAt'>): Invoice {
    const all = getList<Invoice>(INVOICES_KEY);
    const newInvoice: Invoice = {
      ...data,
      id: 'inv_' + Math.random().toString(36).substring(2, 9),
      userId,
      createdAt: Date.now(),
    };
    all.push(newInvoice);
    saveList(INVOICES_KEY, all);

    // Auto-decrement inventory stock if products were selected
    newInvoice.items.forEach((item) => {
      if (item.productId) {
        productsStorage.adjustStock(userId, item.productId, -item.quantity, `Vente facture ${newInvoice.number}`);
      }
    });

    notificationsStorage.addNotification({
      userId,
      type: 'invoice',
      title: `Facture ${newInvoice.number} créée`,
      message: `Facture de ${newInvoice.totalTtc.toLocaleString('fr-FR')} FCFA pour ${newInvoice.clientName}.`,
      read: false,
    });

    return newInvoice;
  },

  update(userId: string, id: string, updates: Partial<Invoice>): Invoice | null {
    const all = getList<Invoice>(INVOICES_KEY);
    const index = all.findIndex((inv) => inv.id === id && inv.userId === userId);
    if (index === -1) return null;

    all[index] = { ...all[index], ...updates };
    saveList(INVOICES_KEY, all);
    return all[index];
  },

  delete(userId: string, id: string): boolean {
    const all = getList<Invoice>(INVOICES_KEY);
    const filtered = all.filter((inv) => !(inv.id === id && inv.userId === userId));
    saveList(INVOICES_KEY, filtered);
    return true;
  },
};

// -------------------------------------------------------------
// Payments Storage (Isolated by userId)
// -------------------------------------------------------------
export const paymentsStorage = {
  getAll(userId: string): Payment[] {
    const list = getList<Payment>(PAYMENTS_KEY);
    return list.filter((p) => p.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  },

  recordPayment(
    userId: string,
    data: {
      invoiceId: string;
      amount: number;
      paymentMethod: Payment['paymentMethod'];
      reference?: string;
      notes?: string;
      paidAt: string;
    }
  ): { payment: Payment; invoice: Invoice } | null {
    const invoice = invoicesStorage.getById(userId, data.invoiceId);
    if (!invoice) return null;

    const allPayments = getList<Payment>(PAYMENTS_KEY);
    const newPayment: Payment = {
      id: 'pay_' + Math.random().toString(36).substring(2, 9),
      userId,
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      reference: data.reference,
      notes: data.notes,
      paidAt: data.paidAt,
      createdAt: Date.now(),
    };

    allPayments.push(newPayment);
    saveList(PAYMENTS_KEY, allPayments);

    // Update invoice paid & remaining amounts
    const newPaidAmount = (invoice.paidAmount || 0) + data.amount;
    const newRemaining = Math.max(0, invoice.totalTtc - newPaidAmount);
    const newStatus = newRemaining === 0 ? 'paid' : newPaidAmount > 0 ? 'partial' : invoice.status;

    const updatedInvoice = invoicesStorage.update(userId, invoice.id, {
      paidAmount: newPaidAmount,
      remainingAmount: newRemaining,
      status: newStatus,
    });

    notificationsStorage.addNotification({
      userId,
      type: 'payment',
      title: `Paiement reçu : ${data.amount.toLocaleString('fr-FR')} FCFA 🎉`,
      message: `Paiement enregistré pour la facture ${invoice.number} (${invoice.clientName}).`,
      read: false,
    });

    return { payment: newPayment, invoice: updatedInvoice! };
  },

  delete(userId: string, id: string): boolean {
    const all = getList<Payment>(PAYMENTS_KEY);
    const filtered = all.filter((p) => !(p.id === id && p.userId === userId));
    saveList(PAYMENTS_KEY, filtered);
    return true;
  },
};

// -------------------------------------------------------------
// Notifications Storage (Isolated by userId)
// -------------------------------------------------------------
export const notificationsStorage = {
  getAll(userId: string): NotificationItem[] {
    const list = getList<NotificationItem>(NOTIFICATIONS_KEY);
    return list.filter((n) => n.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  },

  addNotification(data: Omit<NotificationItem, 'id' | 'createdAt'>): NotificationItem {
    const all = getList<NotificationItem>(NOTIFICATIONS_KEY);
    const newNotif: NotificationItem = {
      ...data,
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };
    all.unshift(newNotif);
    saveList(NOTIFICATIONS_KEY, all);
    return newNotif;
  },

  markAsRead(userId: string, id: string): void {
    const all = getList<NotificationItem>(NOTIFICATIONS_KEY);
    const target = all.find((n) => n.id === id && n.userId === userId);
    if (target) {
      target.read = true;
      saveList(NOTIFICATIONS_KEY, all);
    }
  },

  markAllAsRead(userId: string): void {
    const all = getList<NotificationItem>(NOTIFICATIONS_KEY);
    all.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    saveList(NOTIFICATIONS_KEY, all);
  },
};

// -------------------------------------------------------------
// Team Storage (Isolated by userId)
// -------------------------------------------------------------
export const teamStorage = {
  getAll(userId: string): TeamMember[] {
    const list = getList<TeamMember>(TEAM_KEY);
    return list.filter((t) => t.userId === userId);
  },

  add(userId: string, data: Omit<TeamMember, 'id' | 'userId' | 'createdAt'>): TeamMember {
    const all = getList<TeamMember>(TEAM_KEY);
    const member: TeamMember = {
      ...data,
      id: 'team_' + Math.random().toString(36).substring(2, 9),
      userId,
      createdAt: Date.now(),
    };
    all.push(member);
    saveList(TEAM_KEY, all);
    return member;
  },

  delete(userId: string, id: string): boolean {
    const all = getList<TeamMember>(TEAM_KEY);
    const filtered = all.filter((t) => !(t.id === id && t.userId === userId));
    saveList(TEAM_KEY, filtered);
    return true;
  },
};

// -------------------------------------------------------------
// Real User Stats Calculator (No hardcoded fake numbers)
// -------------------------------------------------------------
export function computeDashboardStats(userId: string) {
  const invoices = invoicesStorage.getAll(userId);
  const clients = clientsStorage.getAll(userId);
  const products = productsStorage.getAll(userId);
  const quotes = quotesStorage.getAll(userId);
  const payments = paymentsStorage.getAll(userId);

  // Total Billed (sum of all invoices TTC except cancelled/draft if needed, but total generated TTC)
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalTtc, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalPending = Math.max(0, totalBilled - totalPaid);

  const lateInvoices = invoices.filter((inv) => {
    if (inv.status === 'paid') return false;
    if (inv.status === 'late') return true;
    if (inv.dueDate && new Date(inv.dueDate).getTime() < Date.now()) return true;
    return false;
  });

  const totalLate = lateInvoices.reduce((sum, inv) => sum + (inv.remainingAmount || 0), 0);

  // Status counts
  const statusCounts = {
    draft: invoices.filter((i) => i.status === 'draft').length,
    sent: invoices.filter((i) => i.status === 'sent').length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    late: lateInvoices.length,
  };

  return {
    totalBilled,
    totalPaid,
    totalPending,
    totalLate,
    invoicesCount: invoices.length,
    clientsCount: clients.length,
    productsCount: products.length,
    quotesCount: quotes.length,
    paymentsCount: payments.length,
    statusCounts,
    hasData: invoices.length > 0 || clients.length > 0 || products.length > 0,
  };
}

// -------------------------------------------------------------
// Demo Data Loader (Optional for user convenience)
// -------------------------------------------------------------
export function seedDemoDataForUser(userId: string): void {
  // Add 3 realistic clients
  const c1 = clientsStorage.add(userId, {
    name: 'Koffi Kouamé',
    company: 'Kouamé & Frères SARL',
    email: 'koffi.kouame@example.com',
    phone: '+225 07 48 92 10 33',
    city: 'Abidjan, Cocody',
    address: 'Rue des Jardins',
  });

  const c2 = clientsStorage.add(userId, {
    name: 'Awa Traoré',
    company: 'Traoré Couture & Mode',
    email: 'awa.couture@example.com',
    phone: '+225 05 12 34 56 78',
    city: 'Abidjan, Marcory',
    address: 'Boulevard VGE',
  });

  const c3 = clientsStorage.add(userId, {
    name: 'Mamadou Touré',
    company: 'Global Tech Consulting',
    email: 'm.toure@globaltech.ci',
    phone: '+225 01 23 45 67 89',
    city: 'Abidjan, Plateau',
    address: 'Immeuble Kharrat',
  });

  // Add 4 products/services
  const p1 = productsStorage.add(userId, {
    type: 'service',
    reference: 'SRV-WEB',
    name: 'Création de site vitrine responsive',
    description: 'Conception UI/UX, intégration mobile, hébergement 1 an',
    unitPrice: 250000,
    vatRate: 18,
    unit: 'forfait',
    stock: 0,
    minStockAlert: 0,
  });

  const p2 = productsStorage.add(userId, {
    type: 'product',
    reference: 'MAT-IMPR',
    name: 'Imprimante thermique tickets de caisse',
    description: 'Modèle USB/Bluetooth haute vitesse 80mm',
    unitPrice: 65000,
    vatRate: 18,
    unit: 'unité',
    stock: 8,
    minStockAlert: 3,
  });

  const p3 = productsStorage.add(userId, {
    type: 'service',
    reference: 'SRV-MAINT',
    name: 'Maintenance informatique mensuelle',
    description: 'Support technique et sauvegarde cloud',
    unitPrice: 45000,
    vatRate: 18,
    unit: 'mois',
    stock: 0,
    minStockAlert: 0,
  });

  const p4 = productsStorage.add(userId, {
    type: 'product',
    reference: 'CON-BOB',
    name: 'Lot de 50 bobines papier thermique',
    description: 'Papier sans bisphénol haute longévité',
    unitPrice: 25000,
    vatRate: 18,
    unit: 'lot',
    stock: 2, // will trigger low stock alert
    minStockAlert: 5,
  });

  // Add 1 Quote
  quotesStorage.add(userId, {
    number: quotesStorage.getNextNumber(userId),
    clientId: c3.id,
    clientName: c3.name,
    clientEmail: c3.email,
    clientPhone: c3.phone,
    clientCompany: c3.company,
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      {
        id: 'item_1',
        productId: p1.id,
        description: p1.name,
        quantity: 1,
        unitPrice: p1.unitPrice,
        vatRate: p1.vatRate,
        totalHt: 250000,
      },
    ],
    subtotalHt: 250000,
    totalVat: 45000,
    discountRate: 0,
    totalTtc: 295000,
    status: 'sent',
    notes: 'Validité de l’offre : 30 jours à compter de l’émission.',
  });

  // Add 2 Invoices (1 paid, 1 pending)
  const today = new Date().toISOString().split('T')[0];
  const duePast = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const inv1 = invoicesStorage.add(userId, {
    number: invoicesStorage.getNextNumber(userId),
    clientId: c1.id,
    clientName: c1.name,
    clientEmail: c1.email,
    clientPhone: c1.phone,
    clientCompany: c1.company,
    issueDate: today,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      {
        id: 'item_inv_1',
        productId: p2.id,
        description: p2.name,
        quantity: 1,
        unitPrice: p2.unitPrice,
        vatRate: p2.vatRate,
        totalHt: 65000,
      },
      {
        id: 'item_inv_2',
        productId: p4.id,
        description: p4.name,
        quantity: 1,
        unitPrice: p4.unitPrice,
        vatRate: p4.vatRate,
        totalHt: 25000,
      },
    ],
    subtotalHt: 90000,
    totalVat: 16200,
    discountRate: 0,
    totalTtc: 106200,
    paidAmount: 106200,
    remainingAmount: 0,
    status: 'paid',
  });

  paymentsStorage.recordPayment(userId, {
    invoiceId: inv1.id,
    amount: 106200,
    paymentMethod: 'mobile_money',
    reference: 'WAVE-CI-99418',
    notes: 'Paiement Wave reçu',
    paidAt: today,
  });

  // Invoice 2: Unpaid/Pending
  invoicesStorage.add(userId, {
    number: invoicesStorage.getNextNumber(userId),
    clientId: c2.id,
    clientName: c2.name,
    clientEmail: c2.email,
    clientPhone: c2.phone,
    clientCompany: c2.company,
    issueDate: duePast,
    dueDate: duePast,
    items: [
      {
        id: 'item_inv_3',
        productId: p3.id,
        description: p3.name,
        quantity: 1,
        unitPrice: p3.unitPrice,
        vatRate: p3.vatRate,
        totalHt: 45000,
      },
    ],
    subtotalHt: 45000,
    totalVat: 8100,
    discountRate: 0,
    totalTtc: 53100,
    paidAmount: 0,
    remainingAmount: 53100,
    status: 'late',
    notes: 'Facture échue en attente de règlement.',
  });
}
