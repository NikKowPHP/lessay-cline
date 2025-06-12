import { NextResponse, NextRequest } from 'next/server'

export function errorHandler(err: Error, req: NextRequest) {
  const statusCode = 500;
  const errorId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  console.error({ errorId, err }, 'Request failed');
  return NextResponse.json(
    { 
      error: err.message,
      errorId,
      statusCode 
    },
    { status: statusCode }
  );
}