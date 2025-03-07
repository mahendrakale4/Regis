import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const { paymentId, status } = await request.json();

        if (!paymentId || !status) {
            return NextResponse.json(
                { error: 'Payment ID and status are required' },
                { status: 400 }
            );
        }

        // Update all registrations with the same paymentId
        const updatedRegistrations = await prisma.registration.updateMany({
            where: {
                paymentId: paymentId
            },
            data: {
                paymentStatus: status
            }
        });

        // Fetch the updated registrations to return
        const refreshedRegistrations = await prisma.registration.findMany({
            where: {
                paymentId: paymentId
            }
        });

        return NextResponse.json({
            message: 'Status updated successfully',
            updatedCount: updatedRegistrations.count,
            registrations: refreshedRegistrations
        });

    } catch (error) {
        console.error('Error updating payment status:', error);
        return NextResponse.json(
            { error: 'Failed to update payment status' },   
            { status: 500 }
        );
    }
} 