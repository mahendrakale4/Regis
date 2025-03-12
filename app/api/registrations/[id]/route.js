import prisma from '../../../../lib/prisma';

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();

        // Remove id from data if present as it shouldn't be updated
        delete data.id;

        // Convert string values to appropriate types based on schema
        const processedData = {
            ...data,
            // Convert numeric fields
            age: data.age ? parseInt(data.age) : null,
            amount: data.amount ? parseFloat(data.amount) : 0,
            firstMealDate: data.firstMealDate ? parseInt(data.firstMealDate) : 0,
            lastMealDate: data.lastMealDate ? parseInt(data.lastMealDate) : 0,
            marriedSinceYear: data.marriedSinceYear ? parseInt(data.marriedSinceYear) : null,

            // Ensure required string fields are not empty
            emailId: data.emailId || '',
            participantName: data.participantName || '',
            campName: data.campName || '',
            firstMealType: data.firstMealType || '',
            lastMealType: data.lastMealType || '',
            dinnerType: data.dinnerType || '',
            accommodation: data.accommodation || '',
            gender: data.gender || '',
            pocName: data.pocName || '',
            pocContact: data.pocContact || '',

            // Optional string fields can be null
            voiceName: data.voiceName || null,
            whatsapp: data.whatsapp || null,
            parentTemple: data.parentTemple || null,
            counselorName: data.counselorName || null,
            participantType: data.participantType || null,
            paymentId: data.paymentId || null,
            deductionSource: data.deductionSource || null,
            passcode: data.passcode || null,
        };

        const updatedRegistration = await prisma.registration.update({
            where: { id: parseInt(id) },
            data: processedData
        });

        return new Response(JSON.stringify(updatedRegistration), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Update error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to update registration',
            details: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
} 