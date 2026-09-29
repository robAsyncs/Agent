export function Payload({ value }: { value: unknown }) {
  if (value === undefined) return null
  const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  return <pre className="payload">{text}</pre>
}
