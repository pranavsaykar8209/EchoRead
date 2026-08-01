import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { MainLayout } from '@/components/layout/MainLayout'
import { ReaderLayout } from '@/components/layout/ReaderLayout'
import { RouteError } from '@/components/ui/ErrorBoundary'

const HomePage = lazy(() => import('@/features/home/pages/HomePage'))
const LibraryPage = lazy(() => import('@/features/library/pages/LibraryPage'))
const UploadPage = lazy(() => import('@/features/upload/pages/UploadPage'))
const ProcessingPage = lazy(() => import('@/features/processing/pages/ProcessingPage'))
const ReaderPage = lazy(() => import('@/features/reader/pages/ReaderPage'))
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'))
const DevStoragePage = lazy(() => import('@/features/dev/pages/DevStoragePage'))
const NotFoundPage = lazy(() => import('@/features/home/pages/NotFoundPage'))

const fallback = (
  <div className="grid min-h-[50vh] place-items-center">
    <Spinner label="Loading page" />
  </div>
)
const load = (page: ReactNode) => <Suspense fallback={fallback}>{page}</Suspense>

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: load(<HomePage />) },
      { path: 'library', element: load(<LibraryPage />) },
      { path: 'upload', element: load(<UploadPage />) },
      { path: 'processing/:bookId', element: load(<ProcessingPage />) },
      { path: 'settings', element: load(<SettingsPage />) },
      { path: 'dev/storage', element: load(<DevStoragePage />) },
    ],
  },
  {
    element: <ReaderLayout />,
    errorElement: <RouteError />,
    children: [{ path: 'reader/:bookId', element: load(<ReaderPage />) }],
  },
  { path: '*', element: load(<NotFoundPage />) },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
