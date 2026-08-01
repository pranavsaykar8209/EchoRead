import { Search } from 'lucide-react'

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <div className="relative max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search books" aria-label="Search books by title or author" className="h-11 w-full rounded-xl border bg-card py-2 pl-10 pr-3 text-sm outline-none ring-primary focus:ring-2" /></div>
}
