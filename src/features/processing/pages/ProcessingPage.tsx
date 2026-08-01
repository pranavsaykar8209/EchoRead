import { useParams } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProcessingManager } from '@/features/processing/components/ProcessingManager'

export default function ProcessingPage() {
  const { bookId } = useParams()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Book Processing Pipeline"
        description="Monitor the stage lifecycle and background synchronization progress of your book."
      />
      {bookId ? (
        <ProcessingManager bookId={bookId} />
      ) : (
        <div className="text-center text-sm text-muted-foreground">No book selected for processing.</div>
      )}
    </div>
  )
}
