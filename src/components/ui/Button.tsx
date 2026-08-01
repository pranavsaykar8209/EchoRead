import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'default' | 'secondary' | 'outline' | 'ghost'
type Size = 'default' | 'sm' | 'lg' | 'icon'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-sm hover:opacity-90',
  default: 'bg-primary text-primary-foreground shadow-sm hover:opacity-90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-muted',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-muted',
}

const sizeStyles: Record<Size, string> = {
  default: 'h-10 px-4 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-12 px-6 text-base',
  icon: 'size-10 p-0',
}

export function Button({ className, variant = 'primary', size = 'default', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-xl font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
        sizeStyles[size] || sizeStyles.default,
        variantStyles[variant] || variantStyles.primary,
        className
      )}
      {...props}
    />
  )
}
