import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // In production, this would validate against a real database
    // For demo purposes, we'll simulate authentication
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Simulate user lookup and validation
    const user = {
      id: `user_${Date.now()}`,
      email: email,
      name: email.split('@')[0], // Simple name extraction
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    // In production, you would:
    // 1. Hash and compare passwords
    // 2. Generate JWT tokens
    // 3. Set secure HTTP-only cookies
    // 4. Implement rate limiting

    return NextResponse.json({
      success: true,
      user: user,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Login endpoint - use POST method',
    methods: ['POST']
  });
}