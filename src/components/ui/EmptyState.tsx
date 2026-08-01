import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description: string; action?: ReactNode }) { return <Card className="flex min-h-60 flex-col items-center justify-center text-center"><div className="mb-4 text-muted-foreground">{icon}</div><h2 className="font-semibold">{title}</h2><p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>{action && <div className="mt-5">{action}</div>}</Card> }
