import { UploadCloud } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
export default function UploadPage() { return <><PageHeader title="Upload book" description="Add a PDF and audiobook. Import workflows will be added in a future release." /><Card className="grid min-h-72 place-items-center border-dashed text-center"><div><UploadCloud className="mx-auto size-9 text-muted-foreground" /><p className="mt-4 font-medium">Book import is being prepared</p><p className="mt-2 text-sm text-muted-foreground">This is a foundation placeholder—no files are processed yet.</p></div></Card></> }
