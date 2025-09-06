import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Basic validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Check if user already exists in database
    // 2. Hash the password
    // 3. Store user in database
    // 4. Generate JWT token
    // 5. Set secure HTTP-only cookies

    const newUser = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase(),
      name: name.trim(),
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Registration endpoint - use POST method',
    methods: ['POST']
  });
}