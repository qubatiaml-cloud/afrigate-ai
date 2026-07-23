"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  CheckCircle2,
  Factory,
  Globe2,
  Handshake,
  Languages,
  Leaf,
  MapPin,
  Menu,
  Plane,
  Ship,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import styles from "./corporate-site.module.css";

type Language = "ar" | "en";
type SectorKey = "investment" | "industry" | "trade" | "logistics";
type ModeKey = "sea" | "air" | "road";
type Project = {
  id: number;
  sector: SectorKey;
  titleAr: string;
  titleEn: string;
  locationAr: string;
  locationEn: string;
  investment: string;
  returnRange: string;
  descriptionAr: string;
  descriptionEn: string;
};

const copy = {
  ar: {
    navHome: "الرئيسية",
    navSectors: "قطاعاتنا",
    navSimulator: "شبكة المسارات",
    navProjects: "الفرص الاستثمارية",
    navWhy: "لماذا أفري جيت",
    navQuote: "طلب أسعار",
    consult: "طلب استشارة",
    signIn: "دخول منصة AfriGate AI",
    badge: "المنصة الرائدة للاستثمار والتجارة العابرة للقارات",
    heroTitleA: "بوابتك الاستراتيجية",
    heroTitleB: "نحو المستقبل الأفريقي والعالمي",
    heroDescription:
      "نصل رأس المال بالفرص الواعدة، والمناطق الصناعية بالأسواق العالمية عبر منظومة متكاملة تجمع الاستثمار والصناعة والتجارة واللوجستيات.",
    explore: "استكشف فرص الاستثمار",
    simulate: "محاكي المسارات اللوجستية",
    networkLabel: "ربط أفريقيا بالأسواق العالمية",
    portfolio: "حجم المحفظة الاستثمارية",
    countries: "دولة في شبكة الأعمال",
    shipments: "شحنة سنوية عبر الموانئ",
    pillarsEyebrow: "ركائز تميزنا الأربعة",
    pillarsTitle: "قطاعات أعمال مترابطة من الفكرة إلى السوق",
    pillarsDescription:
      "منظومة مؤسسية تدعم المشروع من مرحلة الاستثمار والتمويل، مرورًا بالتصنيع والتجارة، وحتى الوصول الآمن إلى الأسواق.",
    investment: "الاستثمار",
    investmentDesc: "تطوير الفرص، هيكلة التمويل، دراسات الجدوى، وإدارة المحافظ والشراكات الاستثمارية.",
    industry: "الصناعة",
    industryDesc: "تطوير وتشغيل المصانع والمجمعات الصناعية وسلاسل القيمة وفق معايير الكفاءة والاستدامة.",
    trade: "التجارة",
    tradeDesc: "تسهيل تجارة السلع والمنتجات، التمويل التجاري، التوريد، والربط بين الموردين والأسواق.",
    logistics: "اللوجستيات",
    logisticsDesc: "حلول الشحن البحري والجوي والبري، التخزين، التوزيع، وإدارة سلاسل الإمداد.",
    simulatorEyebrow: "محاكي استرشادي للمسارات",
    simulatorTitle: "قارن الوقت والمسافة والأثر الكربوني",
    simulatorDescription:
      "اختر نقطة الانطلاق والوجهة ووسيلة النقل للحصول على تقدير أولي يساعدك في تخطيط الشحنة. القيم استرشادية وليست عرض سعر نهائيًا.",
    origin: "نقطة الانطلاق",
    destination: "الوجهة",
    mode: "وسيلة الشحن",
    sea: "بحري",
    air: "جوي",
    road: "بري / متعدد الوسائط",
    workingDays: "أيام العمل المتوقعة",
    distance: "المسافة التقديرية",
    carbon: "خفض الانبعاثات مقابل الشحن الجوي",
    routeReady: "المسار جاهز للتقييم التجاري",
    requestRouteQuote: "اطلب تسعير هذا المسار",
    opportunitiesEyebrow: "فرص مختارة",
    opportunitiesTitle: "مشاريع قابلة للتطوير والاستثمار",
    opportunitiesDescription:
      "نماذج أولية من القطاعات التي تعمل عليها AfriGate. يتم التحقق المالي والفني لكل فرصة قبل تقديمها للمستثمرين.",
    all: "الكل",
    viewOpportunity: "عرض الفرصة",
    investmentSize: "حجم الاستثمار",
    expectedReturn: "العائد المتوقع",
    opportunityNote: "الأرقام المعروضة نطاقات أولية وتخضع للدراسة والعناية الواجبة.",
    close: "إغلاق",
    whyEyebrow: "ميزة AfriGate",
    whyTitle: "شريك واحد يربط القرار بالتنفيذ",
    whyDescription:
      "نجمع الخبرة الاستثمارية والتشغيلية والتجارية واللوجستية في فريق واحد، مع حوكمة واضحة وبيانات قابلة للتتبع.",
    why1: "دراسات استثمارية ومالية مؤسسية",
    why2: "شبكة إقليمية للموردين والمستثمرين",
    why3: "إدارة متكاملة للمشروع وسلسلة الإمداد",
    why4: "تقارير وقرارات موثقة عبر AfriGate AI",
    quoteEyebrow: "ابدأ طلبك",
    quoteTitle: "طلب استشارة أو تسعير أولي",
    quoteDescription: "أكمل الخطوات الثلاث وسنصدر لك رقمًا مرجعيًا لمتابعة الطلب.",
    step: "الخطوة",
    of: "من",
    serviceType: "نوع الطلب",
    quote: "تسعير مسار أو شحنة",
    consultation: "استشارة استثمارية أو صناعية",
    selectSector: "اختر القطاع",
    shipmentVolume: "حجم الشحنة أو نطاق المشروع",
    volumePlaceholder: "مثال: 20 حاوية أو مشروع بقيمة 2 مليون دولار",
    contactDetails: "بيانات التواصل",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    company: "الشركة / الجهة",
    message: "تفاصيل إضافية",
    messagePlaceholder: "اذكر المنتج، الجدول الزمني، السوق المستهدف، أو أي متطلبات خاصة.",
    previous: "السابق",
    next: "التالي",
    send: "إرسال الطلب",
    sending: "جارٍ الإرسال...",
    requestSuccess: "تم تسجيل طلبك بنجاح",
    reference: "الرقم المرجعي",
    requestError: "تعذر تسجيل الطلب. تحقق من البيانات وحاول مرة أخرى.",
    required: "يرجى استكمال الحقول المطلوبة قبل المتابعة.",
    footerLine: "الاستثمار • الصناعة • التجارة • اللوجستيات",
    privacy: "تُستخدم بيانات الطلب للتواصل المهني فقط.",
    locations: {
      Dubai: "دبي",
      Cairo: "القاهرة",
      Guangzhou: "جوانزو",
      Mombasa: "مومباسا",
      Lagos: "لاغوس",
      "Dar es Salaam": "دار السلام",
    } as Record<string, string>,
  },
  en: {
    navHome: "Home",
    navSectors: "Sectors",
    navSimulator: "Route Network",
    navProjects: "Investment Opportunities",
    navWhy: "Why AfriGate",
    navQuote: "Request a Quote",
    consult: "Request a Consultation",
    signIn: "Enter AfriGate AI",
    badge: "A leading platform for cross-continental investment and trade",
    heroTitleA: "Your strategic gateway",
    heroTitleB: "to Africa and global markets",
    heroDescription:
      "We connect capital to promising opportunities and industrial capacity to global markets through investment, industry, trade and logistics.",
    explore: "Explore investment opportunities",
    simulate: "Logistics route simulator",
    networkLabel: "Connecting Africa to global markets",
    portfolio: "Investment portfolio",
    countries: "Countries in our network",
    shipments: "Annual port shipments",
    pillarsEyebrow: "Our four business pillars",
    pillarsTitle: "Connected capabilities from concept to market",
    pillarsDescription:
      "An institutional platform supporting ventures through investment and finance, industrial delivery, trade execution and market access.",
    investment: "Investment",
    investmentDesc: "Opportunity development, financing structures, feasibility studies, portfolio and partnership management.",
    industry: "Industry",
    industryDesc: "Development and operation of factories, industrial parks and value chains with efficiency and sustainability.",
    trade: "Trade",
    tradeDesc: "Commodity and product trade, trade finance, sourcing and connections between suppliers and markets.",
    logistics: "Logistics",
    logisticsDesc: "Sea, air and road freight, warehousing, distribution and end-to-end supply-chain management.",
    simulatorEyebrow: "Indicative route simulator",
    simulatorTitle: "Compare time, distance and carbon impact",
    simulatorDescription:
      "Select an origin, destination and transport mode for an initial planning estimate. Values are indicative and do not constitute a final quotation.",
    origin: "Origin",
    destination: "Destination",
    mode: "Transport mode",
    sea: "Sea freight",
    air: "Air freight",
    road: "Road / multimodal",
    workingDays: "Estimated working days",
    distance: "Estimated distance",
    carbon: "Emission reduction vs air freight",
    routeReady: "Route ready for commercial assessment",
    requestRouteQuote: "Price this route",
    opportunitiesEyebrow: "Selected opportunities",
    opportunitiesTitle: "Projects ready for development and investment",
    opportunitiesDescription:
      "Illustrative opportunities across AfriGate sectors. Each opportunity is financially and technically validated before investor presentation.",
    all: "All",
    viewOpportunity: "View opportunity",
    investmentSize: "Investment size",
    expectedReturn: "Expected return",
    opportunityNote: "Displayed figures are preliminary ranges subject to feasibility and due diligence.",
    close: "Close",
    whyEyebrow: "The AfriGate advantage",
    whyTitle: "One partner connecting decisions to execution",
    whyDescription:
      "We combine investment, operational, commercial and logistics expertise in one accountable team with traceable data and governance.",
    why1: "Institutional investment and financial studies",
    why2: "Regional supplier and investor network",
    why3: "Integrated project and supply-chain delivery",
    why4: "Governed reporting and decisions through AfriGate AI",
    quoteEyebrow: "Start your request",
    quoteTitle: "Request a consultation or initial quote",
    quoteDescription: "Complete three steps and receive a reference number to track your request.",
    step: "Step",
    of: "of",
    serviceType: "Request type",
    quote: "Route or shipment quotation",
    consultation: "Investment or industrial consultation",
    selectSector: "Select a sector",
    shipmentVolume: "Shipment volume or project scope",
    volumePlaceholder: "Example: 20 containers or a USD 2 million project",
    contactDetails: "Contact details",
    fullName: "Full name",
    email: "Email address",
    phone: "Phone",
    company: "Company / organization",
    message: "Additional details",
    messagePlaceholder: "Include the product, timeline, target market or any special requirements.",
    previous: "Previous",
    next: "Next",
    send: "Submit request",
    sending: "Submitting...",
    requestSuccess: "Your request has been registered",
    reference: "Reference number",
    requestError: "The request could not be registered. Check the information and try again.",
    required: "Complete the required fields before continuing.",
    footerLine: "INVESTMENT • INDUSTRY • TRADE • LOGISTICS",
    privacy: "Request data is used only for professional follow-up.",
    locations: {
      Dubai: "Dubai",
      Cairo: "Cairo",
      Guangzhou: "Guangzhou",
      Mombasa: "Mombasa",
      Lagos: "Lagos",
      "Dar es Salaam": "Dar es Salaam",
    } as Record<string, string>,
  },
};

const sectorDefinitions: Array<{ key: SectorKey; icon: LucideIcon }> = [
  { key: "investment", icon: BarChart3 },
  { key: "industry", icon: Factory },
  { key: "trade", icon: Handshake },
  { key: "logistics", icon: Truck },
];

const projects: Project[] = [
  {
    id: 1,
    sector: "agriculture" as SectorKey,
    titleAr: "تعبئة وتصدير العسل الإثيوبي",
    titleEn: "Ethiopian honey packing and export",
    locationAr: "إثيوبيا • هولندا",
    locationEn: "Ethiopia • Netherlands",
    investment: "$1.8M–$2.6M",
    returnRange: "18%–24%",
    descriptionAr: "منشأة متكاملة لفحص وتعبئة العسل وربطه بقنوات توزيع أوروبية عالية القيمة.",
    descriptionEn: "An integrated honey testing and packing facility connected to premium European distribution channels.",
  },
  {
    id: 2,
    sector: "logistics",
    titleAr: "مركز لوجستي للتبريد والتوزيع",
    titleEn: "Cold-chain logistics and distribution hub",
    locationAr: "جيبوتي",
    locationEn: "Djibouti",
    investment: "$6M–$9M",
    returnRange: "15%–21%",
    descriptionAr: "مخازن مبردة وخدمات توزيع لدعم تجارة الأغذية والمنتجات الزراعية في شرق أفريقيا.",
    descriptionEn: "Cold storage and distribution services supporting food and agricultural trade across East Africa.",
  },
  {
    id: 3,
    sector: "industry",
    titleAr: "مجمع للصناعات الغذائية الخفيفة",
    titleEn: "Light food-processing industrial cluster",
    locationAr: "أديس أبابا",
    locationEn: "Addis Ababa",
    investment: "$12M–$18M",
    returnRange: "16%–22%",
    descriptionAr: "وحدات إنتاج مرنة للتعبئة والتغليف والتصنيع الغذائي الموجه للسوق المحلي والتصدير.",
    descriptionEn: "Flexible production units for packaging and food processing serving local and export markets.",
  },
  {
    id: 4,
    sector: "investment",
    titleAr: "صندوق فرص التجارة الأفريقية",
    titleEn: "African trade opportunity fund",
    locationAr: "شرق أفريقيا",
    locationEn: "East Africa",
    investment: "$25M–$40M",
    returnRange: "14%–19%",
    descriptionAr: "محفظة متنوعة لتمويل رأس المال العامل وصفقات السلع والمشروعات القابلة للتوسع.",
    descriptionEn: "A diversified portfolio funding working capital, commodity transactions and scalable ventures.",
  },
];

const routeMatrix: Record<string, { seaNm: number; airKm: number; seaDays: number; airDays: number; roadDays: number }> = {
  "Dubai-Mombasa": { seaNm: 1900, airKm: 3670, seaDays: 9, airDays: 3, roadDays: 13 },
  "Dubai-Lagos": { seaNm: 5800, airKm: 5900, seaDays: 23, airDays: 4, roadDays: 28 },
  "Dubai-Dar es Salaam": { seaNm: 2200, airKm: 3970, seaDays: 11, airDays: 3, roadDays: 15 },
  "Cairo-Mombasa": { seaNm: 2500, airKm: 3550, seaDays: 13, airDays: 3, roadDays: 11 },
  "Cairo-Lagos": { seaNm: 4700, airKm: 3930, seaDays: 21, airDays: 3, roadDays: 16 },
  "Cairo-Dar es Salaam": { seaNm: 2900, airKm: 4200, seaDays: 15, airDays: 3, roadDays: 13 },
  "Guangzhou-Mombasa": { seaNm: 5100, airKm: 8500, seaDays: 20, airDays: 5, roadDays: 27 },
  "Guangzhou-Lagos": { seaNm: 9400, airKm: 11700, seaDays: 36, airDays: 6, roadDays: 43 },
  "Guangzhou-Dar es Salaam": { seaNm: 5500, airKm: 8700, seaDays: 22, airDays: 5, roadDays: 29 },
};

const sectorAccent: Record<SectorKey, string> = {
  investment: styles.investment,
  industry: styles.industry,
  trade: styles.trade,
  logistics: styles.logistics,
};

export default function CorporateSite() {
  const [language, setLanguage] = useState<Language>("ar");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [origin, setOrigin] = useState("Dubai");
  const [destination, setDestination] = useState("Mombasa");
  const [mode, setMode] = useState<ModeKey>("sea");
  const [filter, setFilter] = useState<"all" | SectorKey>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const [form, setForm] = useState({
    requestType: "QUOTE",
    sector: "logistics",
    volume: "",
    fullName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const t = copy[language];
  const isArabic = language === "ar";

  useEffect(() => {
    const saved = window.localStorage.getItem("afrigate-language");
    if (saved === "ar" || saved === "en") setLanguage(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    window.localStorage.setItem("afrigate-language", language);
  }, [isArabic, language]);

  const route = useMemo(() => {
    const base = routeMatrix[`${origin}-${destination}`];
    if (mode === "air") {
      return { days: base.airDays, distance: `${base.airKm.toLocaleString()} KM`, carbon: "0%", progress: 78 };
    }
    if (mode === "road") {
      return {
        days: base.roadDays,
        distance: `${Math.round(base.airKm * 1.28).toLocaleString()} KM`,
        carbon: "42%",
        progress: 54,
      };
    }
    return { days: base.seaDays, distance: `${base.seaNm.toLocaleString()} NM`, carbon: "78%", progress: 64 };
  }, [destination, mode, origin]);

  const filteredProjects = projects.filter((project) => filter === "all" || project.sector === filter);
  const ModeIcon = mode === "sea" ? Ship : mode === "air" ? Plane : Truck;
  const DirectionIcon = isArabic ? ArrowLeft : ArrowRight;

  function changeLanguage() {
    setLanguage((current) => (current === "ar" ? "en" : "ar"));
  }

  function updateForm(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  }

  function validateStep() {
    if (wizardStep === 1 && (!form.requestType || !form.sector)) return false;
    if (wizardStep === 2 && !form.volume.trim()) return false;
    if (wizardStep === 3 && (!form.fullName.trim() || !form.email.trim())) return false;
    return true;
  }

  function nextStep() {
    if (!validateStep()) {
      setFormError(t.required);
      return;
    }
    setFormError("");
    setWizardStep((current) => Math.min(3, current + 1));
  }

  function priceCurrentRoute() {
    setForm((current) => ({
      ...current,
      requestType: "QUOTE",
      sector: "logistics",
      message: `${origin} → ${destination} (${mode})`,
    }));
    setWizardStep(2);
    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep()) {
      setFormError(t.required);
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          language,
          origin: form.requestType === "QUOTE" ? origin : undefined,
          destination: form.requestType === "QUOTE" ? destination : undefined,
          transportMode: form.requestType === "QUOTE" ? mode : undefined,
        }),
      });
      const payload = (await response.json()) as { reference?: string; error?: string };
      if (!response.ok || !payload.reference) throw new Error(payload.error || "Request failed");
      setReference(payload.reference);
    } catch {
      setFormError(t.requestError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.site} dir={isArabic ? "rtl" : "ltr"}>
      <header className={styles.header}>
        <a className={styles.brand} href="#home" aria-label="AfriGate home">
          <span className={styles.brandMark}><i /><i /></span>
          <span><strong><b>Afri</b>Gate</strong><small>{t.footerLine}</small></span>
        </a>
        <nav className={`${styles.nav} ${mobileOpen ? styles.navOpen : ""}`}>
          <a href="#home" onClick={() => setMobileOpen(false)}>{t.navHome}</a>
          <a href="#sectors" onClick={() => setMobileOpen(false)}>{t.navSectors}</a>
          <a href="#simulator" onClick={() => setMobileOpen(false)}>{t.navSimulator}</a>
          <a href="#projects" onClick={() => setMobileOpen(false)}>{t.navProjects}</a>
          <a href="#why" onClick={() => setMobileOpen(false)}>{t.navWhy}</a>
          <a href="#quote" onClick={() => setMobileOpen(false)}>{t.navQuote}</a>
        </nav>
        <div className={styles.headerActions}>
          <button className={styles.languageButton} type="button" onClick={changeLanguage} aria-label="Change language">
            <Languages size={17} /> {isArabic ? "EN" : "عربي"}
          </button>
          <a className={styles.headerCta} href="#quote">{t.consult}</a>
          <button className={styles.menuButton} type="button" onClick={() => setMobileOpen((value) => !value)} aria-label="Menu">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className={styles.hero} id="home">
          <div className={styles.heroGrid} />
          <div className={styles.heroGlow} />
          <div className={styles.heroCopy}>
            <span className={styles.badge}><Sparkles size={15} />{t.badge}</span>
            <h1>{t.heroTitleA}<em>{t.heroTitleB}</em></h1>
            <p>{t.heroDescription}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryButton} href="#projects">{t.explore}<DirectionIcon size={17} /></a>
              <a className={styles.secondaryButton} href="#simulator"><Globe2 size={18} />{t.simulate}</a>
            </div>
            <div className={styles.heroStats}>
              <div><strong>$120M+</strong><span>{t.portfolio}</span></div>
              <div><strong>18</strong><span>{t.countries}</span></div>
              <div><strong>1,450+</strong><span>{t.shipments}</span></div>
            </div>
          </div>

          <div className={styles.heroVisual} aria-label={t.networkLabel}>
            <div className={styles.orbitOne} />
            <div className={styles.orbitTwo} />
            <div className={styles.globe}><Globe2 /></div>
            <span className={`${styles.orbitNode} ${styles.nodeOne}`}><Building2 /></span>
            <span className={`${styles.orbitNode} ${styles.nodeTwo}`}><Factory /></span>
            <span className={`${styles.orbitNode} ${styles.nodeThree}`}><Ship /></span>
            <span className={`${styles.orbitNode} ${styles.nodeFour}`}><Boxes /></span>
            <div className={styles.visualLabel}><i /><span>{t.networkLabel}<small>DJIBOUTI • ETHIOPIA • MENA • EUROPE</small></span></div>
          </div>
        </section>

        <section className={styles.section} id="sectors">
          <div className={styles.sectionHeading}>
            <span>{t.pillarsEyebrow}</span>
            <h2>{t.pillarsTitle}</h2>
            <p>{t.pillarsDescription}</p>
          </div>
          <div className={styles.sectorGrid}>
            {sectorDefinitions.map(({ key, icon: Icon }, index) => (
              <article className={`${styles.sectorCard} ${sectorAccent[key]}`} key={key}>
                <header><span>0{index + 1}</span><Icon /></header>
                <h3>{t[key]}</h3>
                <p>{t[`${key}Desc` as keyof typeof t] as string}</p>
                <a href="#quote">{t.consult}<DirectionIcon /></a>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.simulatorSection}`} id="simulator">
          <div className={styles.simulatorIntro}>
            <span>{t.simulatorEyebrow}</span>
            <h2>{t.simulatorTitle}</h2>
            <p>{t.simulatorDescription}</p>
            <div className={styles.routeControls}>
              <label><span>{t.origin}</span><select value={origin} onChange={(event) => setOrigin(event.target.value)}>{["Dubai", "Cairo", "Guangzhou"].map((location) => <option key={location} value={location}>{t.locations[location]}</option>)}</select></label>
              <label><span>{t.destination}</span><select value={destination} onChange={(event) => setDestination(event.target.value)}>{["Mombasa", "Lagos", "Dar es Salaam"].map((location) => <option key={location} value={location}>{t.locations[location]}</option>)}</select></label>
              <label><span>{t.mode}</span><select value={mode} onChange={(event) => setMode(event.target.value as ModeKey)}><option value="sea">{t.sea}</option><option value="air">{t.air}</option><option value="road">{t.road}</option></select></label>
            </div>
          </div>

          <div className={styles.routeCard}>
            <header><span><i />{t.routeReady}</span><ModeIcon /></header>
            <div className={styles.routeCities}>
              <div><small>{t.origin}</small><strong>{t.locations[origin]}</strong></div>
              <div className={styles.routeLine}><span style={{ width: `${route.progress}%` }} /><ModeIcon /></div>
              <div><small>{t.destination}</small><strong>{t.locations[destination]}</strong></div>
            </div>
            <div className={styles.routeMetrics}>
              <div><small>{t.workingDays}</small><strong>{route.days}</strong></div>
              <div><small>{t.distance}</small><strong>{route.distance}</strong></div>
              <div><small>{t.carbon}</small><strong>{route.carbon}</strong></div>
            </div>
            <button className={styles.primaryButton} type="button" onClick={priceCurrentRoute}>{t.requestRouteQuote}<DirectionIcon size={17} /></button>
          </div>
        </section>

        <section className={styles.section} id="projects">
          <div className={styles.sectionHeading}>
            <span>{t.opportunitiesEyebrow}</span>
            <h2>{t.opportunitiesTitle}</h2>
            <p>{t.opportunitiesDescription}</p>
          </div>
          <div className={styles.filters}>
            <button className={filter === "all" ? styles.activeFilter : ""} onClick={() => setFilter("all")}>{t.all}</button>
            {sectorDefinitions.map(({ key }) => <button className={filter === key ? styles.activeFilter : ""} key={key} onClick={() => setFilter(key)}>{t[key]}</button>)}
          </div>
          <div className={styles.projectGrid}>
            {filteredProjects.map((project) => (
              <article className={styles.projectCard} key={project.id}>
                <div className={`${styles.projectVisual} ${sectorAccent[project.sector]}`}><span>{project.id.toString().padStart(2, "0")}</span><Globe2 /></div>
                <div className={styles.projectBody}>
                  <span><MapPin />{isArabic ? project.locationAr : project.locationEn}</span>
                  <h3>{isArabic ? project.titleAr : project.titleEn}</h3>
                  <p>{isArabic ? project.descriptionAr : project.descriptionEn}</p>
                  <div><small>{t.investmentSize}<strong>{project.investment}</strong></small><small>{t.expectedReturn}<strong>{project.returnRange}</strong></small></div>
                  <button type="button" onClick={() => setSelectedProject(project)}>{t.viewOpportunity}<DirectionIcon /></button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.section} ${styles.whySection}`} id="why">
          <div className={styles.whyVisual}>
            <div><Globe2 /><strong>AfriGate</strong><span>INTEGRATED VALUE NETWORK</span></div>
            <i /><i /><i />
          </div>
          <div className={styles.whyCopy}>
            <span>{t.whyEyebrow}</span>
            <h2>{t.whyTitle}</h2>
            <p>{t.whyDescription}</p>
            <ul>
              {[t.why1, t.why2, t.why3, t.why4].map((item) => <li key={item}><CheckCircle2 />{item}</li>)}
            </ul>
            <a className={styles.secondaryButton} href="/login">{t.signIn}<DirectionIcon size={17} /></a>
          </div>
        </section>

        <section className={`${styles.section} ${styles.quoteSection}`} id="quote">
          <div className={styles.quoteIntro}>
            <span>{t.quoteEyebrow}</span>
            <h2>{t.quoteTitle}</h2>
            <p>{t.quoteDescription}</p>
            <div className={styles.stepIndicator}>{[1, 2, 3].map((step) => <span className={wizardStep >= step ? styles.completeStep : ""} key={step}>{step}</span>)}</div>
          </div>

          <form className={styles.quoteForm} onSubmit={submitRequest}>
            {reference ? (
              <div className={styles.successState}>
                <CheckCircle2 />
                <h3>{t.requestSuccess}</h3>
                <p>{t.reference}</p>
                <strong>{reference}</strong>
                <small>{t.privacy}</small>
              </div>
            ) : (
              <>
                <header><span>{t.step} {wizardStep} {t.of} 3</span><strong>{wizardStep === 1 ? t.serviceType : wizardStep === 2 ? t.shipmentVolume : t.contactDetails}</strong></header>
                {wizardStep === 1 && <div className={styles.formGrid}>
                  <label><span>{t.serviceType}</span><select value={form.requestType} onChange={(event) => updateForm("requestType", event.target.value)}><option value="QUOTE">{t.quote}</option><option value="CONSULTATION">{t.consultation}</option></select></label>
                  <label><span>{t.selectSector}</span><select value={form.sector} onChange={(event) => updateForm("sector", event.target.value)}>{sectorDefinitions.map(({ key }) => <option value={key} key={key}>{t[key]}</option>)}</select></label>
                </div>}
                {wizardStep === 2 && <div className={styles.formGrid}>
                  <label className={styles.fullField}><span>{t.shipmentVolume}</span><input value={form.volume} onChange={(event) => updateForm("volume", event.target.value)} placeholder={t.volumePlaceholder} maxLength={200} /></label>
                  {form.requestType === "QUOTE" && <div className={`${styles.fullField} ${styles.routeSummary}`}><Ship /><span>{t.locations[origin]} <DirectionIcon /> {t.locations[destination]}</span><strong>{mode === "sea" ? t.sea : mode === "air" ? t.air : t.road}</strong></div>}
                </div>}
                {wizardStep === 3 && <div className={styles.formGrid}>
                  <label><span>{t.fullName} *</span><input value={form.fullName} onChange={(event) => updateForm("fullName", event.target.value)} required maxLength={120} /></label>
                  <label><span>{t.email} *</span><input type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} required maxLength={254} /></label>
                  <label><span>{t.phone}</span><input value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} maxLength={40} /></label>
                  <label><span>{t.company}</span><input value={form.company} onChange={(event) => updateForm("company", event.target.value)} maxLength={150} /></label>
                  <label className={styles.fullField}><span>{t.message}</span><textarea value={form.message} onChange={(event) => updateForm("message", event.target.value)} placeholder={t.messagePlaceholder} maxLength={2000} /></label>
                </div>}
                {formError && <p className={styles.formError}>{formError}</p>}
                <footer>
                  {wizardStep > 1 && <button className={styles.backButton} type="button" onClick={() => setWizardStep((current) => current - 1)}>{isArabic ? <ArrowRight /> : <ArrowLeft />}{t.previous}</button>}
                  {wizardStep < 3 ? <button className={styles.primaryButton} type="button" onClick={nextStep}>{t.next}<DirectionIcon /></button> : <button className={styles.primaryButton} type="submit" disabled={submitting}>{submitting ? t.sending : t.send}<DirectionIcon /></button>}
                </footer>
              </>
            )}
          </form>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.brand}><span className={styles.brandMark}><i /><i /></span><span><strong><b>Afri</b>Gate</strong><small>{t.footerLine}</small></span></div>
        <div><span>Doraleh Free Zone, Djibouti</span><span>+253 21 35 7200</span><a href="mailto:info@afrigate.com">info@afrigate.com</a></div>
        <p>© 2026 AfriGate. {t.privacy}</p>
      </footer>

      {selectedProject && <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setSelectedProject(null)}>
        <article className={styles.modal} role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
          <header><span className={sectorAccent[selectedProject.sector]}><Globe2 /></span><button type="button" onClick={() => setSelectedProject(null)} aria-label={t.close}><X /></button></header>
          <span><MapPin />{isArabic ? selectedProject.locationAr : selectedProject.locationEn}</span>
          <h2>{isArabic ? selectedProject.titleAr : selectedProject.titleEn}</h2>
          <p>{isArabic ? selectedProject.descriptionAr : selectedProject.descriptionEn}</p>
          <div><small>{t.investmentSize}<strong>{selectedProject.investment}</strong></small><small>{t.expectedReturn}<strong>{selectedProject.returnRange}</strong></small></div>
          <em>{t.opportunityNote}</em>
          <a className={styles.primaryButton} href="#quote" onClick={() => { setSelectedProject(null); setForm((current) => ({ ...current, requestType: "CONSULTATION", sector: selectedProject.sector })); }}>{t.consult}<DirectionIcon /></a>
        </article>
      </div>}
    </div>
  );
}
