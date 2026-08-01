import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useRouteError } from 'react-router-dom'

function ErrorScreen() { return <main className="grid min-h-screen place-items-center p-6 text-center"><div><h1 className="text-2xl font-semibold">Something went wrong</h1><a className="mt-4 inline-block underline" href="/">Return home</a></div></main> }
export class ErrorBoundary extends Component<{ children?: ReactNode }, { hasError: boolean }> { state = { hasError: false }; static getDerivedStateFromError() { return { hasError: true } }; componentDidCatch(error: Error, info: ErrorInfo) { console.error('Application error:', error, info) }; render() { return this.state.hasError ? <ErrorScreen /> : this.props.children } }
export function RouteError() { useRouteError(); return <ErrorScreen /> }
