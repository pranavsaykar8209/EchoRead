import { Library as LibraryIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
export default function LibraryPage() { return <><PageHeader title="Library" description="Your books will live here, ready to pick up anytime." action={<Link to="/upload"><Button>Add book</Button></Link>} /><EmptyState icon={<LibraryIcon className="size-8" />} title="Your library is empty" description="Upload a PDF and its audiobook to begin building your reading library." /></> }
