import prisma from '../../../lib/prisma';
import crypto from 'crypto';

export async function POST(request) {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            entries,
            email,
            amount,
            paymentMethod,  // Add this to distinguish between IDT and Razorpay
        } = await request.json();

        // Validate based on payment method
        if (paymentMethod === 'RAZORPAY') {
            // Validate Razorpay payment details
            if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
                throw new Error('Missing payment details');
            }

            // Verify payment signature using Razorpay's HMAC method
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(sign.toString())
                .digest('hex');

            if (razorpay_signature !== expectedSign) {
                throw new Error('Payment signature verification failed');
            }
        }

        // Add data validation for the entries
        const validateEntry = (entry) => {
            if (!entry.firstMealDate || !entry.lastMealDate) {
                throw new Error('Meal dates are required');
            }

            // Convert meal dates to integers
            const firstMealDate = parseInt(entry.firstMealDate);
            const lastMealDate = parseInt(entry.lastMealDate);

            if (isNaN(firstMealDate) || isNaN(lastMealDate)) {
                throw new Error('Invalid meal date format');
            }

            // Validate the entry and return the formatted data
            return {
                emailId: email,
                voiceName: entry.voiceName || null,
                participantName: entry.participantName,
                whatsapp: entry.whatsapp || null,
                parentTemple: entry.parentTemple || null,
                counselorName: entry.counselorName || null,
                campName: entry.campName,
                firstMealDate,
                firstMealType: entry.firstMealType,
                lastMealDate,
                lastMealType: entry.lastMealType,
                dinnerType: entry.dinnerType,
                accommodation: entry.accommodation,
                gender: entry.gender,
                participantType: entry.participantType,
                age: parseInt(entry.age),
                marriedSinceYear: entry.marriedSinceYear ? parseInt(entry.marriedSinceYear) : null,
                pocName: entry.pocName,
                pocContact: entry.pocContact,
                paymentId: paymentMethod === 'RAZORPAY' ? razorpay_payment_id : null,
                deductionSource: paymentMethod === 'RAZORPAY' ? 'RAZORPAY' : 'IDT',
                passcode: entry.passcode || null,
                amount: parseFloat(amount),
            };
        };

        // Payment is verified, proceed with saving the registrations
        const registrations = await Promise.all(
            entries.map(async (entry) => {
                const validatedData = validateEntry(entry);
                return await prisma.registration.create({
                    data: validatedData,
                });
            })
        );

        // Return success response after saving entries
        return new Response(
            JSON.stringify({
                success: true,
                message: 'Payment verified and registrations saved',
                registrations,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Payment verification error:', error);

        const errorMessage = {
            'Missing payment details': 400,
            'Payment signature verification failed': 401,
            'Invalid meal date format': 400,
            // Add more specific error cases
        }[error.message] || 500;

        return new Response(
            JSON.stringify({
                error: error.message || 'Payment verification failed',
                code: error.code || 'UNKNOWN_ERROR'
            }),
            {
                status: errorMessage,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
