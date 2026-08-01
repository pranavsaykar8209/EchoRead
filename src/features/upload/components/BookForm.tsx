import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { bookStorage } from '@/features/library/services/bookStorage'
import { processingService } from '@/features/processing/services/processing.service'
import { FilePicker } from '@/features/upload/components/FilePicker'

type FieldErrors = Partial<Record<'title' | 'pdf' | 'audio', string>>
const isPdf = (file: File) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
const isAudio = (file: File) => ['.mp3', '.m4a', '.wav'].some((extension) => file.name.toLowerCase().endsWith(extension))

export function BookForm() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [pdfFile, setPdfFile] = useState<File>()
  const [audioFile, setAudioFile] = useState<File>()
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSaving, setIsSaving] = useState(false)

  const validate = (): FieldErrors => {
    const next: FieldErrors = {}
    if (!title.trim()) next.title = 'Enter a title for this book.'
    if (!pdfFile) next.pdf = 'Choose a PDF file.'
    else if (!isPdf(pdfFile)) next.pdf = 'Choose a valid PDF file.'
    if (!audioFile) next.audio = 'Choose an MP3, M4A, or WAV file.'
    else if (!isAudio(audioFile)) next.audio = 'Supported formats are MP3, M4A, and WAV.'
    return next
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || !pdfFile || !audioFile) return
    setIsSaving(true)
    try {
      const created = await bookStorage.create({ title, author, pdfFile, audioFile })
      void processingService.startProcessing(created.id)
      toast.success('Book added to your library')
      navigate('/library')
    } catch {
      toast.error('We couldn’t save this book locally. Please try again.')
    } finally { setIsSaving(false) }
  }

  const onPdfChange = (file?: File) => { setPdfFile(file); setErrors((current) => ({ ...current, pdf: file && !isPdf(file) ? 'Choose a valid PDF file.' : undefined })) }
  const onAudioChange = (file?: File) => { setAudioFile(file); setErrors((current) => ({ ...current, audio: file && !isAudio(file) ? 'Supported formats are MP3, M4A, and WAV.' : undefined })) }
  const canSave = Boolean(title.trim() && pdfFile && audioFile && isPdf(pdfFile) && isAudio(audioFile) && !isSaving)

  return <form noValidate onSubmit={onSubmit} className="space-y-7"><div><label htmlFor="book-title" className="text-sm font-medium">Book title</label><input id="book-title" value={title} onChange={(event) => { setTitle(event.target.value); setErrors((current) => ({ ...current, title: undefined })) }} className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3 text-sm outline-none ring-primary focus:ring-2" aria-invalid={Boolean(errors.title)} />{errors.title && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}</div><div><label htmlFor="book-author" className="text-sm font-medium">Author <span className="text-muted-foreground">(optional)</span></label><input id="book-author" value={author} onChange={(event) => setAuthor(event.target.value)} className="mt-2 h-11 w-full rounded-xl border bg-transparent px-3 text-sm outline-none ring-primary focus:ring-2" /></div><div className="border-t pt-7"><FilePicker label="PDF" kind="pdf" accept="application/pdf,.pdf" file={pdfFile} error={errors.pdf} onChange={onPdfChange} /></div><div className="border-t pt-7"><FilePicker label="Audiobook" kind="audio" accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,.mp3,.m4a,.wav" file={audioFile} error={errors.audio} onChange={onAudioChange} /></div><div className="flex flex-col-reverse gap-3 border-t pt-7 sm:flex-row sm:justify-end"><Button type="button" variant="secondary" onClick={() => navigate('/library')}>Cancel</Button><Button type="submit" disabled={!canSave}>{isSaving ? 'Saving…' : 'Save book'}</Button></div></form>
}
