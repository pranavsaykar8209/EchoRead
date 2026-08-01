import { Library } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

export function EmptyLibrary({ isSearchResult = false }: { isSearchResult?: boolean }) {
  return <EmptyState icon={<Library className="size-8" />} title={isSearchResult ? 'No books found' : 'No books found'} description={isSearchResult ? 'Try a different title or author.' : 'Import your first book to get started.'} action={!isSearchResult ? <Link to="/upload"><Button>Import book</Button></Link> : undefined} />
}
