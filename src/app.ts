import 'dotenv/config'
import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import path from 'node:path'
import cors from 'cors'
import { pinoHttp } from 'pino-http'
import { logger, randomID } from './logger.js'

const allowedOrigins = new Set([
  'https://zmtportfolio.com',
  'https://www.zmtportfolio.com',
  'https://dev.zmtportfolio.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
])

const allowedCorsMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] as const
const allowedCorsMethodSet = new Set<string>(allowedCorsMethods)

const allowedCorsHeaders = ['content-type', 'authorization', 'x-request-id']
const allowedCorsHeaderSet = new Set<string>(allowedCorsHeaders)

// Routing Imports
import {
  recaptcha,
  email,
//   auth,
//   users,
  contact
} from './routes/index.js';

// Middleware Imports
import { routeLogger } from './middlewares/routeLogs.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

const isHealth = (p: string) => /^\/health(?:$|\/)/.test(p)

app.use(
  pinoHttp({
    logger,
    autoLogging: false,
    genReqId(req, res) {
      const id = (req.headers['x-request-id'] as string) ?? randomID();
      res.setHeader('X-Request-Id', id);
      return id;
    },
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie'],
      remove: true
    },
    customProps: (req) => ({
      userId: (req as any).user?.uid ?? null,
      ip: req.ip
    })
  })
);

// Explicit CORS validation + logging so failed preflights are obvious
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin

  if (!origin) return next()

  if (!allowedOrigins.has(origin)) {
    req.log.warn({
      origin,
      method: req.method,
      path: req.originalUrl
    }, 'cors blocked: origin not allowed')

    res.status(403).json({
      success: false,
      message: `CORS blocked: origin not allowed (${origin})`,
      requestId: (req as any).id || res.getHeader('X-Request-Id') || null
    })
    return
  }

  if (req.method === 'OPTIONS') {
    const requestedMethod = String(req.headers['access-control-request-method'] ?? '').toUpperCase()
    const requestedHeadersRaw = String(req.headers['access-control-request-headers'] ?? '')
    const requestedHeaders = requestedHeadersRaw.split(',').map(header => header.trim().toLowerCase()).filter(Boolean)

    const methodAllowed = !requestedMethod || allowedCorsMethodSet.has(requestedMethod)
    const disallowedHeaders = requestedHeaders.filter(header => !allowedCorsHeaderSet.has(header))

    if (!methodAllowed || disallowedHeaders.length > 0) {
      req.log.warn({
        origin,
        path: req.originalUrl,
        requestedMethod: requestedMethod || null,
        requestedHeaders,
        methodAllowed,
        disallowedHeaders,
        allowedMethods: [...allowedCorsMethodSet],
        allowedHeaders: [...allowedCorsHeaderSet]
      }, 'cors blocked: preflight rejected')

      res.status(403).json({
        success: false,
        message: 'CORS blocked: preflight rejected',
        details: {
          origin,
          requestedMethod: requestedMethod || null,
          requestedHeaders,
          methodAllowed,
          disallowedHeaders
        },
        requestId: (req as any).id || res.getHeader('X-Request-Id') || null
      })
      return
    }

    req.log.debug({
      origin,
      path: req.originalUrl,
      requestedMethod: requestedMethod || null,
      requestedHeaders
    }, 'cors preflight allowed')
  }

  next()
})

// CORS for API routes
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true)

    if (allowedOrigins.has(origin)) {
      logger.debug({ origin }, 'CORS origin allowed')
      return cb(null, true)
    }

    logger.warn({ origin }, 'CORS origin rejected')
    return cb(new Error(`Not allowed by CORS: ${origin}`))
  },
  credentials: true,
  methods: [...allowedCorsMethods],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id', 'X-Filename', 'Content-Disposition'],
  maxAge: 86400
}))

app.use(routeLogger({
  name: 'api',
  skip: (req) =>
    isHealth(req.path) ||
    req.path.startsWith('/uploads')
}))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const isCorsError = err.message.toLowerCase().includes('cors')

  if (isCorsError) {
    req.log.warn({
      err: {
        message: err.message,
        stack: err.stack
      },
      method: req.method,
      path: req.originalUrl,
      origin: req.headers.origin ?? null,
      accessControlRequestMethod: req.headers['access-control-request-method'] ?? null,
      accessControlRequestHeaders: req.headers['access-control-request-headers'] ?? null
    }, 'cors-error')
  }

  next(err)
})

const staticPath = path.resolve(process.cwd(), 'static')
app.use('/static', express.static(staticPath))

app.use(express.json())

// Routes
app.use('/api/recaptcha', recaptcha)
app.use('/api/email', email)
app.use('/api/contact', contact)

app.get('/', (_req, res) => {
  res.status(403).send('<h1>Access is not Available.</h1>')
})

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' })
})

app.use(errorHandler)
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  req.log.error({ err }, 'unhandled-error')
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    requestId: (req as any).id || res.getHeader('X-Request-Id') || null
  })
})

export default app