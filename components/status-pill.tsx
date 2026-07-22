export function StatusPill({ status }: { status: string }) {
  const tone = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-pill ${tone}`}><i />{status}</span>;
}
