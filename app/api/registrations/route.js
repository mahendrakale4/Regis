import prisma from '../../../lib/prisma';

export async function GET() {
    try {
        const registrations = await prisma.registration.findMany({
            orderBy: {
                id: 'desc'
            }
        });

        return new Response(JSON.stringify(registrations), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch registrations' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
} 