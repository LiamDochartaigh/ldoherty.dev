import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/_public/stats')({
  component: RouteComponent,
})

type ConnectionStatus = 'connecting' | 'connected' | 'closed' | 'error'

interface ServerStats {
  cpu: number
  memoryFree: number,
  memoryTotal: number,
  memoryUsed: number
  uptime: number
  platform?: string
}

function formatBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(1)} KB`
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const parts = []
  if (d) parts.push(`${d}d`)
  if (h) parts.push(`${h}h`)
  parts.push(`${m}m`)
  return parts.join(' ')
}

function GaugeBar({ value, max = 1, color = 'bg-primary' }: { value: number; max?: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100)
  const barColor = pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-yellow-400' : color
  return (
    <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden mt-2">
      <div
        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-lg p-5 flex flex-col gap-1 border border-white/5">
      <span className="text-xs text-muted font-display uppercase tracking-widest">{label}</span>
      {children}
    </div>
  )
}

function RouteComponent() {
  const [stats, setStats] = useState<ServerStats | null>(null)
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const wsUrl = import.meta.env.DEV
      ? 'ws://localhost:3000/ws/stats'
      : `wss://${window.location.host}/ws/stats`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => setStatus('connected')
    ws.onclose = () => setStatus('closed')
    ws.onerror = () => setStatus('error')
    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data as string) as ServerStats
      setStats(parsed)
    }

    return () => ws.close()
  }, [])

  const statusColor: Record<ConnectionStatus, string> = {
    connecting: 'text-yellow-400',
    connected: 'text-green-400',
    closed: 'text-muted',
    error: 'text-red-400',
  }

  const cpuPct = stats ? Math.round(stats.cpu * 100) : 0
  const memUsedPct = stats ? (stats.memoryUsed / stats.memoryTotal) * 100 : 0

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-8">
        <div>
          <h1 className="font-display text-4xl text-primary">Server Stats</h1>
        </div>
        <span className={`text-xs self-end font-mono ${statusColor[status]}`}>[{status}]</span>
      </div>

      {!stats ? (
        <p className="text-muted text-sm">Waiting for data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard label="CPU">
            <span className="text-3xl font-display text-primary">{cpuPct}<span className="text-lg text-muted">%</span></span>
            <GaugeBar value={stats.cpu} />
          </StatCard>

          <StatCard label="Memory">
            <span className="text-3xl font-display text-primary">
              {formatBytes(stats.memoryUsed)}
            </span>
            <span className="text-xs text-muted">of {formatBytes(stats.memoryTotal)} · {Math.round(memUsedPct)}% used</span>
            <GaugeBar value={stats.memoryUsed} max={stats.memoryTotal} />
          </StatCard>

          <StatCard label="Uptime">
            <span className="text-3xl font-display text-primary">{formatUptime(stats.uptime)}</span>
          </StatCard>
        </div>
      )}
    </div>
  )
}
