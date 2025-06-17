// src/app/api/auth/signup/route.ts
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';
import { NextResponse } from 'next/server';

// Ensure Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

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

    // Debug: Log what's available in prisma
    console.log('Prisma client available methods:', Object.keys(prisma));

    // Check if user already exists - your schema has "User" model
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

    // Create user - your schema has "User" model with these exact fields
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
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}