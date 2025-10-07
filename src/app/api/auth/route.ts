import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Hardcoded credentials
const CREDENTIALS = {
  username: 'payProduct',
  password: 'payProduct!@#',
};

const SESSION_COOKIE_NAME = 'roadmap-session';
const SESSION_VALUE = 'authenticated';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, action } = body;

    // Handle logout
    if (action === 'logout') {
      const cookieStore = await cookies();
      cookieStore.delete(SESSION_COOKIE_NAME);
      return NextResponse.json({ success: true, message: 'Logged out successfully' });
    }

    // Handle login
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, SESSION_VALUE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
      });

      return NextResponse.json({ success: true, message: 'Login successful' });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    
    return NextResponse.json({
      authenticated: session?.value === SESSION_VALUE,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}

