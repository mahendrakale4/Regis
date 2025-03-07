// app/api/register/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import calculateCost from "../../(pages)/mem/cost"

// Initialize Prisma client
const prisma = new PrismaClient();

export async function POST(request) {
    try {
        // Parse the request body
        const data = await request.json();

        // Validate incoming data
        if (!Array.isArray(data.entries) || data.entries.length === 0) {
            return NextResponse.json({ error: 'No entries provided' }, { status: 400 });
        }
        const emaildata = data.emailId;

        // Process registrations
        const registrations = [];

        for (const entry of data.entries) {
            let amount = 0;
            if (typeof calculateCost === 'function') {
                amount = calculateCost(
                    entry.firstMealDate,
                    entry.firstMealType,
                    entry.lastMealDate,
                    entry.lastMealType,
                    entry.accommodation,
                    entry.participantType
                );
            } else {
                amount = 0;
            }

            // Create registration in database
            const registration = await prisma.registration.create({
                data: {
                    pocName: entry.pocName || '',
                    pocContact: entry.pocContact || '',
                    voiceName: entry.voiceName || '',
                    participantName: entry.participantName || '',
                    participantType: entry.participantType || '',
                    gender: entry.gender || '',
                    whatsapp: entry.whatsapp || '',
                    parentTemple: entry.parentTemple || '',
                    counselorName: entry.counselorName || '',
                    campName: entry.campName || '',
                    firstMealDate: parseInt(entry.firstMealDate) || 0,
                    firstMealType: entry.firstMealType || '',
                    lastMealDate: parseInt(entry.lastMealDate) || 0,
                    lastMealType: entry.lastMealType || '',
                    dinnerType: entry.dinnerType || 'Dinner Meal',
                    accommodation: entry.accommodation || '',
                    amount: amount,
                    emailId: emaildata ? emaildata : null,
                    deductionSource: data.paymentMethod === 'IDT' ? data.deductionSource : '',
                    passcode: data.paymentMethod === 'IDT' ? data.passcode : '',
                    paymentId: data.paymentId || null,
                    paymentStatus: data.paymentStatus || ''
                }
            });

            registrations.push(registration);
        }

        // Return success response
        return NextResponse.json({
            success: true,
            message: 'Registrations created successfully',
            count: registrations.length
        });
    } catch (error) {
        console.error('Registration error:', error);

        // Return a proper JSON error response
        return NextResponse.json({
            error: 'Failed to create registrations',
            details: error.message
        }, { status: 500 });
    }
}
