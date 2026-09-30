import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      message: 'AtmoCraft is running optimally.',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
