import { weeklyVolume } from "@/lib/data";

function coordinates(values: number[]) {
  const width = 680;
  const height = 190;
  const min = Math.min(...values) - 8;
  const max = Math.max(...values) + 6;
  return values.map((value, index) => ({
    x: (index / (values.length - 1)) * width,
    y: height - ((value - min) / (max - min)) * height,
  }));
}

export function VolumeChart() {
  const points = coordinates(weeklyVolume);
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const area = `${line} L680,210 L0,210 Z`;
  return (
    <div className="chart-wrap">
      <div className="chart-y-labels"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
      <svg className="volume-chart" viewBox="0 0 680 220" preserveAspectRatio="none" role="img" aria-label="Shipment volume increased over twelve weeks">
        <defs>
          <linearGradient id="volume-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#16a673" stopOpacity=".25" />
            <stop offset="100%" stopColor="#16a673" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 65, 110, 155, 200].map((y) => <line key={y} x1="0" x2="680" y1={y} y2={y} className="grid-line" />)}
        <path d={area} fill="url(#volume-fill)" />
        <path d={line} className="chart-line" />
        {points.map((point, index) => index === points.length - 1 ? <circle key={index} cx={point.x} cy={point.y} r="5" className="chart-dot" /> : null)}
      </svg>
      <div className="chart-x-labels"><span>May 4</span><span>May 25</span><span>Jun 15</span><span>Jul 6</span><span>Jul 20</span></div>
    </div>
  );
}
