import * as pdfjs from 'pdfjs-dist'
import { AppConfig } from '@/config/app.config'
import type { BookPage } from '@/features/library/types/book'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

export interface ExtractedBook {
  totalPages: number
  pages: BookPage[]
}

function normalizePageText(items: Awaited<ReturnType<pdfjs.PDFPageProxy['getTextContent']>>['items']) {
  return items
    .map((item) => {
      if (!('str' in item)) return ''
      return `${item.str}${item.hasEOL ? '\n' : ' '}`
    })
    .join('')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

/**
 * Extracts searchable PDF text once, respecting Development Mode configuration limits.
 */
export async function extractPdfText(file: Blob): Promise<ExtractedBook> {
  const data = new Uint8Array(await file.arrayBuffer())
  const loadingTask = pdfjs.getDocument({ data })
  const document = await loadingTask.promise

  try {
    const pages: BookPage[] = []

    // Limit pages processed if Development Mode is enabled
    const maxPagesToExtract = AppConfig.developmentProcessing
      ? Math.min(document.numPages, AppConfig.maxPages)
      : document.numPages

    for (let pageNumber = 1; pageNumber <= maxPagesToExtract; pageNumber += 1) {
      const page = await document.getPage(pageNumber)
      const content = await page.getTextContent()
      pages.push({ pageNumber, text: normalizePageText(content.items) })
    }

    return { totalPages: maxPagesToExtract, pages }
  } finally {
    await loadingTask.destroy()
  }
}
