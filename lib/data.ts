export type ShipmentStatus = "In transit" | "Customs" | "Delayed" | "Delivered" | "Booking";

export type Shipment = {
  reference: string;
  customer: string;
  customerCode: string;
  cargo: string;
  origin: string;
  destination: string;
  route: string;
  mode: "Sea" | "Air" | "Road" | "Rail";
  status: ShipmentStatus;
  progress: number;
  eta: string;
  value: string;
};

export const shipments: Shipment[] = [
  {
    reference: "AFG-24891",
    customer: "Kibo Retail Group",
    customerCode: "KRG",
    cargo: "Consumer electronics",
    origin: "Shenzhen, CN",
    destination: "Mombasa, KE",
    route: "Shenzhen → Mombasa",
    mode: "Sea",
    status: "In transit",
    progress: 72,
    eta: "24 Jul, 16:30",
    value: "$248,400",
  },
  {
    reference: "AFG-24876",
    customer: "Savanna Health",
    customerCode: "SH",
    cargo: "Medical equipment",
    origin: "Frankfurt, DE",
    destination: "Nairobi, KE",
    route: "Frankfurt → Nairobi",
    mode: "Air",
    status: "Customs",
    progress: 88,
    eta: "22 Jul, 19:10",
    value: "$182,750",
  },
  {
    reference: "AFG-24854",
    customer: "Atlas Build Co.",
    customerCode: "AB",
    cargo: "Industrial fittings",
    origin: "Durban, ZA",
    destination: "Lusaka, ZM",
    route: "Durban → Lusaka",
    mode: "Road",
    status: "Delayed",
    progress: 53,
    eta: "26 Jul, 08:45",
    value: "$96,200",
  },
  {
    reference: "AFG-24842",
    customer: "Nile Agro Export",
    customerCode: "NA",
    cargo: "Processed coffee",
    origin: "Kampala, UG",
    destination: "Alexandria, EG",
    route: "Kampala → Alexandria",
    mode: "Road",
    status: "In transit",
    progress: 64,
    eta: "28 Jul, 14:00",
    value: "$134,800",
  },
  {
    reference: "AFG-24819",
    customer: "Teranga Foods",
    customerCode: "TF",
    cargo: "Food packaging",
    origin: "Casablanca, MA",
    destination: "Dakar, SN",
    route: "Casablanca → Dakar",
    mode: "Sea",
    status: "Delivered",
    progress: 100,
    eta: "20 Jul, 11:20",
    value: "$78,600",
  },
  {
    reference: "AFG-24798",
    customer: "Kibo Retail Group",
    customerCode: "KRG",
    cargo: "Home appliances",
    origin: "Istanbul, TR",
    destination: "Dar es Salaam, TZ",
    route: "Istanbul → Dar es Salaam",
    mode: "Sea",
    status: "Booking",
    progress: 12,
    eta: "08 Aug, 09:00",
    value: "$215,900",
  },
];

export const networkLocations = [
  { city: "Mombasa", country: "Kenya", x: 69, y: 54, volume: 82 },
  { city: "Nairobi", country: "Kenya", x: 66, y: 46, volume: 74 },
  { city: "Lagos", country: "Nigeria", x: 34, y: 48, volume: 68 },
  { city: "Durban", country: "South Africa", x: 58, y: 79, volume: 52 },
  { city: "Casablanca", country: "Morocco", x: 31, y: 17, volume: 43 },
  { city: "Cairo", country: "Egypt", x: 61, y: 20, volume: 61 },
  { city: "Dakar", country: "Senegal", x: 17, y: 38, volume: 38 },
];

export const weeklyVolume = [31, 44, 39, 56, 52, 68, 61, 79, 73, 88, 84, 96];

export const customers = [
  { name: "Kibo Retail Group", code: "KRG", country: "Kenya", shipments: 42, value: "$1.84M", health: 94, trend: "+12%" },
  { name: "Savanna Health", code: "SH", country: "Rwanda", shipments: 31, value: "$1.21M", health: 91, trend: "+8%" },
  { name: "Atlas Build Co.", code: "AB", country: "Zambia", shipments: 27, value: "$986K", health: 78, trend: "−3%" },
  { name: "Nile Agro Export", code: "NA", country: "Uganda", shipments: 24, value: "$742K", health: 88, trend: "+16%" },
  { name: "Teranga Foods", code: "TF", country: "Senegal", shipments: 19, value: "$594K", health: 86, trend: "+5%" },
];

export const documents = [
  { name: "Bill of Lading — AFG-24891", type: "Bill of lading", owner: "Kibo Retail Group", updated: "18 min ago", status: "Approved" },
  { name: "KE Import Declaration Form", type: "Customs", owner: "Savanna Health", updated: "42 min ago", status: "Review" },
  { name: "Certificate of Origin — ZA", type: "Certificate", owner: "Atlas Build Co.", updated: "2 hours ago", status: "Approved" },
  { name: "Commercial Invoice — AFG-24842", type: "Invoice", owner: "Nile Agro Export", updated: "Yesterday", status: "Draft" },
  { name: "Cargo Insurance Policy", type: "Insurance", owner: "Kibo Retail Group", updated: "21 Jul 2026", status: "Expires soon" },
];

export const insights = [
  {
    eyebrow: "DELAY RISK",
    title: "AFG-24854 may arrive 18 hours late",
    body: "Border congestion near Chirundu is 31% above the 30-day average. Rerouting via Kazungula preserves the delivery window.",
    action: "Review alternate route",
    tone: "warning",
    confidence: 92,
  },
  {
    eyebrow: "COST OPPORTUNITY",
    title: "Consolidate two August sailings",
    body: "Combining Kibo Retail bookings AFG-24798 and AFG-24795 can reduce container cost by an estimated $8,420.",
    action: "View consolidation",
    tone: "success",
    confidence: 89,
  },
  {
    eyebrow: "COMPLIANCE",
    title: "Insurance renewal due in 9 days",
    body: "The master cargo policy supporting five active shipments expires on 31 July. Renewal documents are ready for review.",
    action: "Open documents",
    tone: "info",
    confidence: 100,
  },
];
