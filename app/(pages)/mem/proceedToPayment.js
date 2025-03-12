export async function proceedToPayment(entries, email, amount, isUPIPayment = false) {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                entries,
                email,
                amount,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to process registration');
        }

        return await response.json();
    } catch (error) {
        console.error('Payment processing error:', error);
        throw error;
    }
}