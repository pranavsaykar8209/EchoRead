import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
export default function NotFoundPage() { return <main className="mx-auto grid min-h-screen max-w-xl place-items-center p-5"><EmptyState title="Page not found" description="The page you’re looking for doesn’t exist or has moved." action={<Link to="/"><Button>Return home</Button></Link>} /></main> }
