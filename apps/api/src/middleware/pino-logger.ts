import { pinoLogger as honoPinoLogger } from 'hono-pino'
import pino from 'pino'
import pretty from 'pino-pretty'

export const pinoLogger = () => {
  return honoPinoLogger({
    pino: pino({ level: 'debug' }, pretty()),
  })
}
