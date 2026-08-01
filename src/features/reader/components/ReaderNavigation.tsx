import { PageNavigation } from '@/features/reader/components/PageNavigation'
import { useReaderStore } from '@/store/readerStore'

export function ReaderNavigation() {
  const { currentPage, totalPages, setCurrentPage } = useReaderStore()
  return (
    <div className="sticky bottom-20 z-20 mx-auto my-4 flex shrink-0 justify-center rounded-2xl border border-border/80 bg-card/95 px-6 py-3 shadow-xl backdrop-blur-md transition-all">
      <PageNavigation page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
    </div>
  )
}
