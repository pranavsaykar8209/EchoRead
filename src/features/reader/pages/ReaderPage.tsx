import { BookOpen } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
export default function ReaderPage() { const { bookId } = useParams(); return <div className="flex min-h-screen flex-col p-5 sm:p-8"><header className="flex items-center gap-2 text-sm font-medium"><BookOpen className="size-4" /> EchoRead reader</header><section className="grid flex-1 place-items-center"><Card className="max-w-lg text-center"><h1 className="text-xl font-semibold">Reader workspace</h1><p className="mt-3 text-sm text-muted-foreground">Book {bookId ?? 'unknown'} will be displayed here. PDF rendering and synchronization are intentionally not implemented yet.</p></Card></section></div> }
