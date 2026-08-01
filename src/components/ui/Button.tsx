import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }
export function Button({ className, variant = 'primary', ...props }: Props) {
  return <button className={cn('inline-flex h-10 cursor-pointer items-center justify-center rounded-xl px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50', { primary: 'bg-primary text-primary-foreground shadow-sm hover:opacity-90', secondary: 'bg-secondary text-secondary-foreground hover:bg-muted', ghost: 'hover:bg-muted' }[variant], className)} {...props} />
}
