import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
    try {
        const { amount } = await request.json();

        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };

        const order = await razorpay.orders.create(options);

        return new Response(JSON.stringify(order), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return new Response(JSON.stringify({ error: 'Error creating order' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}