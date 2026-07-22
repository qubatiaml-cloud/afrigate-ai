import { PrismaClient, ShipmentStatus, TransportMode, UserRole, DocumentStatus, InsightSeverity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { slug: "afrigate-demo" },
    update: {},
    create: { name: "AfriGate Demo", slug: "afrigate-demo", plan: "GROWTH" },
  });

  await prisma.user.upsert({
    where: { email: "amina@afrigate.ai" },
    update: {},
    create: {
      name: "Amina Yusuf",
      email: "amina@afrigate.ai",
      role: UserRole.OWNER,
      workspaceId: workspace.id,
    },
  });

  const customer = await prisma.customer.upsert({
    where: { workspaceId_code: { workspaceId: workspace.id, code: "KRG" } },
    update: {},
    create: {
      name: "Kibo Retail Group",
      code: "KRG",
      country: "Kenya",
      contactName: "Daniel Otieno",
      contactEmail: "daniel@kibo.example",
      healthScore: 94,
      workspaceId: workspace.id,
    },
  });

  const shipment = await prisma.shipment.upsert({
    where: { reference: "AFG-24891" },
    update: {},
    create: {
      reference: "AFG-24891",
      cargo: "Consumer electronics",
      origin: "Shenzhen, CN",
      destination: "Mombasa, KE",
      status: ShipmentStatus.IN_TRANSIT,
      mode: TransportMode.SEA,
      progress: 72,
      value: 248400,
      co2Kg: 1320,
      departureDate: new Date("2026-07-03T08:00:00Z"),
      eta: new Date("2026-07-24T16:30:00Z"),
      customerId: customer.id,
      workspaceId: workspace.id,
    },
  });

  const eventCount = await prisma.shipmentEvent.count({ where: { shipmentId: shipment.id } });
  if (eventCount === 0) {
    await prisma.shipmentEvent.createMany({
      data: [
        { title: "Booking confirmed", location: "Shenzhen, CN", occurredAt: new Date("2026-07-01T09:15:00Z"), shipmentId: shipment.id },
        { title: "Departed origin port", location: "Yantian, CN", occurredAt: new Date("2026-07-03T08:00:00Z"), shipmentId: shipment.id },
        { title: "Transshipment completed", location: "Colombo, LK", occurredAt: new Date("2026-07-14T12:40:00Z"), shipmentId: shipment.id },
      ],
    });
  }

  const documentCount = await prisma.document.count({ where: { workspaceId: workspace.id } });
  if (documentCount === 0) {
    await prisma.document.create({
      data: {
        name: "Bill of Lading — AFG-24891",
        type: "Bill of lading",
        status: DocumentStatus.APPROVED,
        customerId: customer.id,
        shipmentId: shipment.id,
        workspaceId: workspace.id,
      },
    });
  }

  const insightCount = await prisma.insight.count({ where: { workspaceId: workspace.id } });
  if (insightCount === 0) {
    await prisma.insight.create({
      data: {
        title: "Consolidate two August sailings",
        body: "Combining two Kibo Retail bookings can reduce container cost by an estimated $8,420.",
        action: "View consolidation",
        severity: InsightSeverity.OPPORTUNITY,
        confidence: 89,
        workspaceId: workspace.id,
      },
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
