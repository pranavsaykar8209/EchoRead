import { AppProviders } from '@/app/providers/AppProviders'
import { AppRouter } from '@/app/router/AppRouter'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

export function App() {
  return <AppProviders><ErrorBoundary><AppRouter /></ErrorBoundary></AppProviders>
}
