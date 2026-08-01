import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { BookForm } from '@/features/upload/components/BookForm'
export default function UploadPage() { return <div className="mx-auto max-w-2xl"><PageHeader title="Add new book" description="Import a PDF and its audiobook to your local library." /><Card><BookForm /></Card></div> }
