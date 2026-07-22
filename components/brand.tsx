import Link from "next/link";
export function Brand({ href = "/" }: { href?: string }) { return <Link className="brand" href={href}><span className="brand-mark"><i /><i /><i /></span><span>AfriGate <b>AI</b></span></Link>; }
