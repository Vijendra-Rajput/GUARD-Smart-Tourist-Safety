import React, { createContext, useContext, useMemo, useState } from "react";

export type Lang = string;

export const LANG_OPTIONS: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "as", label: "Assamese" },
  { code: "bn", label: "Bengali" },
  { code: "brx", label: "Bodo" },
  { code: "doi", label: "Dogri" },
  { code: "gu", label: "Gujarati" },
  { code: "hi", label: "Hindi" },
  { code: "kn", label: "Kannada" },
  { code: "ks", label: "Kashmiri" },
  { code: "kok", label: "Konkani" },
  { code: "mai", label: "Maithili" },
  { code: "ml", label: "Malayalam" },
  { code: "mni", label: "Manipuri (Meitei)" },
  { code: "mr", label: "Marathi" },
  { code: "ne", label: "Nepali" },
  { code: "or", label: "Odia" },
  { code: "pa", label: "Punjabi" },
  { code: "sa", label: "Sanskrit" },
  { code: "sat", label: "Santali" },
  { code: "sd", label: "Sindhi" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "ur", label: "Urdu" },
];

const strings: Record<string, Record<string, string>> = {
  en: {
    app: "GUARD",
    tagline: "Smart Tourist Safety",
    touristView: "Tourist View",
    adminDashboard: "Admin Dashboard",
    offline: "Offline",
    language: "Language",
    register: "Register",
    name: "Full name",
    phone: "Phone number",
    consent: "I consent to location use for my safety",
    generateId: "Generate Digital ID",
    yourId: "Your Digital ID",
    dashboard: "Personal Dashboard",
    safetyScore: "Safety Score",
    itinerary: "Itinerary",
    map: "Map",
    breadcrumb: "Breadcrumb Trail",
    panic: "PANIC",
    cancel: "Cancel",
    confirmPanicTitle: "Send Emergency Alert?",
    confirmPanicDesc: "This will notify authorities and your emergency contacts immediately.",
    sent: "Alert Sent",
    liveAlerts: "Live Alerts",
    searchById: "Search by Tourist ID",
    acknowledge: "Acknowledge",
    escalate: "Escalate",
    blockchain: "Blockchain Status",
    committed: "Committed",
  },
  es: {
    app: "GUARD",
    tagline: "Seguridad Inteligente para Turistas",
    touristView: "Vista Turista",
    adminDashboard: "Panel Admin",
    offline: "Sin conexión",
    language: "Idioma",
    register: "Registrarse",
    name: "Nombre completo",
    phone: "Número de teléfono",
    consent: "Consiento el uso de ubicación para mi seguridad",
    generateId: "Generar ID Digital",
    yourId: "Tu ID Digital",
    dashboard: "Panel Personal",
    safetyScore: "Puntaje de Seguridad",
    itinerary: "Itinerario",
    map: "Mapa",
    breadcrumb: "Rastro",
    panic: "PÁNICO",
    cancel: "Cancelar",
    confirmPanicTitle: "¿Enviar Alerta de Emergencia?",
    confirmPanicDesc: "Se notificará a las autoridades y contactos de emergencia.",
    sent: "Alerta Enviada",
    liveAlerts: "Alertas en Vivo",
    searchById: "Buscar por ID de Turista",
    acknowledge: "Reconocer",
    escalate: "Escalar",
    blockchain: "Estado Blockchain",
    committed: "Confirmado",
  },
  hi: {
    app: "GUARD",
    tagline: "स्मार्ट पर्यटक सुरक्षा",
    touristView: "पर्यटक दृश्य",
    adminDashboard: "प्रशासन डैशबोर्ड",
    offline: "ऑफ़लाइन",
    language: "भाषा",
    register: "पंजीकरण",
    name: "पूरा नाम",
    phone: "फ़ोन नंबर",
    consent: "मेरी सुरक्षा के लिए स्थान उपयोग की सहमति",
    generateId: "डिजिटल आईडी बनाएँ",
    yourId: "आपकी डिजिटल आईडी",
    dashboard: "व्यक्तिगत डैशबो��्ड",
    safetyScore: "सुरक्षा स्कोर",
    itinerary: "यात्रा कार्यक्रम",
    map: "मानचित्र",
    breadcrumb: "ब्रेडक्रम ट्रेल",
    panic: "घबराहट",
    cancel: "रद्द करें",
    confirmPanicTitle: "आपातकालीन अलर्ट भेजें?",
    confirmPanicDesc: "इससे तुरंत अधिकारियों और आपात संपर्कों को सूचित किया जाएगा।",
    sent: "अलर्ट भेजा गया",
    liveAlerts: "लाइव अलर्ट",
    searchById: "टूरिस्ट आईडी से खोजें",
    acknowledge: "स्वीकारें",
    escalate: "एस्केलेट",
    blockchain: "ब्लॉकचेन स्थिति",
    committed: "कमिटेड",
  },
};

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("en");
  const t = useMemo(() => {
    const table = strings[lang];
    return (key: string) => table[key] ?? key;
  }, [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
