// src/app/api/auth/signup/route.ts
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs'; // Changed from bcrypt to bcryptjs
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' }, 
        { status: 400 }
      );
    }

    // Hash password with bcryptjs
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { 
        email, 
        name, 
        password: hashedPassword 
      },
    });

    // Return user without password for security
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      message: 'User created successfully',
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}