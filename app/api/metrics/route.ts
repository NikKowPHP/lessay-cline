import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { collectDefaultMetrics, register, Counter, Histogram } from 'prom-client';

export async function GET() {
  // Register default metrics
  collectDefaultMetrics();

  // Define custom metrics
  const httpRequestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
  });

  const httpResponseTimeHistogram = new Histogram({
    name: 'http_response_time_seconds',
    help: 'Response time of HTTP requests in seconds',
    labelNames: ['method', 'route']
  });

  // Register custom metrics
  register.registerMetric(httpRequestCounter);
  register.registerMetric(httpResponseTimeHistogram);

  try {
    // Generate metrics
    const metrics = await register.metrics();

    return new NextResponse(metrics, {
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8'
      }
    });
  } catch (error) {
    logger.error({ error }, 'Error generating metrics');
    return new NextResponse('Error generating metrics', { status: 500 });
  }
}