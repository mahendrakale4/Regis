import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';
import prisma from '../../../lib/prisma';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

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

        // Create new user
        const user = await prisma.user.create({
            data: {
                email,
                password, // Note: In a real application, you should hash the password
            }
        });

        return NextResponse.json({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
} 