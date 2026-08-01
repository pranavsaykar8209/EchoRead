import { ArrowRight, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
export default function HomePage() { return <div className="py-8 sm:py-16"><motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><Badge>Offline-first reading</Badge><h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Read the page. Hear the story.</h1><p className="mt-5 max-w-xl text-lg text-muted-foreground">EchoRead is a calm, private space for bringing your books and audiobooks together.</p><div className="mt-8 flex gap-3"><Link to="/upload"><Button>Add a book <ArrowRight className="ml-2 size-4" /></Button></Link><Link to="/library"><Button variant="secondary">Browse library</Button></Link></div></motion.div><Card className="mt-14 grid min-h-64 place-items-center border-dashed bg-muted/30"><div className="text-center"><BookOpen className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 font-medium">Your reading space is ready</p><p className="mt-1 text-sm text-muted-foreground">Add your first book when you’re ready.</p></div></Card></div> }
