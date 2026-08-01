import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn } from '@/lib/cn'
import { useSettingsStore, type Theme } from '@/store/settingsStore'

const themes: Array<{ value: Theme; label: string; icon: typeof Sun; description: string }> = [
  { value: 'light', label: 'Light', icon: Sun, description: 'Always use the light appearance.' },
  { value: 'dark', label: 'Dark', icon: Moon, description: 'Always use the dark appearance.' },
  { value: 'system', label: 'System', icon: Monitor, description: 'Match your device setting.' },
]

export default function SettingsPage() {
  const theme = useSettingsStore((state) => state.theme)
  const setTheme = useSettingsStore((state) => state.setTheme)
  return <><PageHeader title="Settings" description="Personalize EchoRead as its capabilities grow." /><Card><h2 className="font-medium">Appearance</h2><p className="mt-2 text-sm text-muted-foreground">Choose a theme for EchoRead. This preference is saved locally and will apply to future features.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{themes.map(({ value, label, icon: Icon, description }) => <Button key={value} type="button" variant="secondary" aria-pressed={theme === value} onClick={() => setTheme(value)} className={cn('h-auto items-start justify-start p-4 text-left', theme === value && 'bg-primary text-primary-foreground hover:bg-primary')}><Icon className="mr-3 mt-0.5 size-4 shrink-0" /><span><span className="block">{label}</span><span className={cn('mt-1 block text-xs font-normal text-muted-foreground', theme === value && 'text-primary-foreground/70')}>{description}</span></span></Button>)}</div></Card></>
}
