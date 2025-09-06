import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'MindCare API',
      version: '1.0.0',
      endpoints: {
        auth: {
          login: '/api/auth/login',
          register: '/api/auth/register'
        },
        assessments: '/api/assessments',
        mood: '/api/mood',
        health: '/api/health'
      },
      message: 'MindCare Mental Health API is running successfully'
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}