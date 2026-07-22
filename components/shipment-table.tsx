import Link from "next/link";
import { ArrowUpRight, Plane, Ship, TrainFront, Truck } from "lucide-react";
import { shipments } from "@/lib/data";
import { StatusPill } from "@/components/status-pill";

const modeIcons = { Sea: Ship, Air: Plane, Road: Truck, Rail: TrainFront };

export function ShipmentTable({ limit }: { limit?: number }) {
  const rows = limit ? shipments.slice(0, limit) : shipments;
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead><tr><th>Shipment</th><th>Customer</th><th>Route</th><th>Status</th><th>Progress</th><th>ETA</th><th /></tr></thead>
        <tbody>
          {rows.map((shipment) => {
            const ModeIcon = modeIcons[shipment.mode];
            return (
              <tr key={shipment.reference}>
                <td><strong>{shipment.reference}</strong><small><ModeIcon size={13} /> {shipment.mode} · {shipment.cargo}</small></td>
                <td><span className="customer-cell"><i>{shipment.customerCode}</i><span>{shipment.customer}<small>{shipment.value}</small></span></span></td>
                <td><strong className="route-text">{shipment.origin}</strong><small>to {shipment.destination}</small></td>
                <td><StatusPill status={shipment.status} /></td>
                <td><span className="progress-cell"><span><i style={{ width: `${shipment.progress}%` }} /></span><small>{shipment.progress}%</small></span></td>
                <td><strong className="eta-text">{shipment.eta.split(", ")[0]}</strong><small>{shipment.eta.split(", ")[1]}</small></td>
                <td><Link className="table-action" href={`/shipments?ref=${shipment.reference}`} aria-label={`Open ${shipment.reference}`}><ArrowUpRight size={16} /></Link></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
