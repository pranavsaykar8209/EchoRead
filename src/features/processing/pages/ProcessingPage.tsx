import { useParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
export default function ProcessingPage() { const { bookId } = useParams(); return <><PageHeader title="Preparing your book" description={`Book ${bookId ?? 'unknown'} is queued for future processing capabilities.`} /><Card className="flex min-h-64 items-center justify-center"><Spinner label="Processing will be available soon" /></Card></> }
