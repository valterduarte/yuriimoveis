type LogLevel = 'error' | 'warn' | 'info'

interface LogContext {
  operation: string
  [key: string]: unknown
}

function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack }
  }
  return { value: String(error) }
}

function emit(level: LogLevel, message: string, context: LogContext, error?: unknown): void {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
    ...(error !== undefined && { error: serializeError(error) }),
  }
  const line = JSON.stringify(payload)
  if (level === 'error')      console.error(line)
  else if (level === 'warn')  console.warn(line)
  else                         console.log(line)
}

export function logDbError(operation: string, error: unknown, extra: Record<string, unknown> = {}): void {
  emit('error', `Database query failed: ${operation}`, { operation, ...extra }, error)
}

export function logWarn(operation: string, message: string, extra: Record<string, unknown> = {}): void {
  emit('warn', message, { operation, ...extra })
}
