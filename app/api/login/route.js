import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || user.password !== password) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            message: 'Login successful',
            user: { email: user.email }
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to login' },
            { status: 500 }
        );
    }
} 