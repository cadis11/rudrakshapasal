export function inRange(iso?: string, from?: string | null, to?: string | null): boolean {
  if (!iso) return false
  const d = new Date(iso); if (Number.isNaN(d.getTime())) return false
  let ok = true
  if (from) { const df = new Date(from); df.setHours(0,0,0,0); ok = ok && d >= df }
  if (to)   { const dt = new Date(to);   dt.setHours(23,59,59,999); ok = ok && d <= dt }
  return ok
}
export function getRangeFromUrl(url: URL){ return { from: url.searchParams.get("from") || undefined, to: url.searchParams.get("to") || undefined } }