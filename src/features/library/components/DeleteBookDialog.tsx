import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { Book } from '@/features/library/types/book'

export function DeleteBookDialog({ book, isDeleting, onCancel, onConfirm }: { book?: Book; isDeleting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return <Modal open={Boolean(book)} onClose={onCancel} title="Delete book"><div><div className="flex gap-3"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" /><p className="text-sm text-muted-foreground">Delete <span className="font-medium text-foreground">{book?.title}</span>? Its PDF, audiobook, and local metadata will be permanently removed from this device.</p></div><div className="mt-6 flex justify-end gap-3"><Button type="button" variant="secondary" onClick={onCancel} disabled={isDeleting}>Cancel</Button><Button type="button" className="bg-red-600 text-white hover:bg-red-700" onClick={onConfirm} disabled={isDeleting}>{isDeleting ? 'Deleting…' : 'Delete book'}</Button></div></div></Modal>
}
