export const proceedToPayment = async (
    entries,
    email,
    calculateTotalCost,
    setIsSubmitting,
    setSubmitStatus,
    setPocEntered,
    setEntries,
    setPocDetails,
    deductionSource,
    passcode
) => {
    setIsSubmitting(true);
    setSubmitStatus({
        type: 'info',
        message: 'Processing your registration...',
        icon: '⚙️'
    });

    const isUPIPayment = deductionSource === 'UPI Payment';

    // Generate a more secure payment ID for UPI payments
    const paymentId = isUPIPayment ?
        'UPI' + Math.random().toString(36).substring(2, 8).toUpperCase() +
        Date.now().toString().slice(-4) : null;

    // Set initial payment status
    const paymentStatus = isUPIPayment ? 'verifying' : 'processing';

    try {
        // Prepare the request body with enhanced details
        const requestBody = {
            entries,
            totalAmount: calculateTotalCost(),
            emailId: email,
            paymentMethod: isUPIPayment ? 'UPI' : 'IDT',
            timestamp: new Date().toISOString(),
            ...(isUPIPayment ? {
                paymentId,
                paymentStatus,
            } : {
                deductionSource,
                passcode,
            })
        };

        const response = await fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            throw new Error(`Registration failed: ${response.status === 400 ? 'Invalid details' : 'Server error'}`);
        }

        const result = await response.json();

        // Show success message with appropriate icon and details
        setSubmitStatus({
            type: 'success',
            message: isUPIPayment
                ? `Registration successful! Your payment ID is ${paymentId}. We'll verify your payment within 24-48 hours.`
                : 'Registration successful! Your IDT payment has been processed.',
            icon: isUPIPayment ? '🔄' : '✅',
            details: isUPIPayment ? {
                paymentId,
                amount: calculateTotalCost(),
                status: 'Verifying'
            } : null
        });

        // Clear form after successful submission with a delay
        setTimeout(() => {
            setEntries([]);
            setPocEntered(false);
            setPocDetails({
                pocName: "",
                pocContact: "",
            });
            setSubmitStatus(null);
        }, 5000); // Increased to 5 seconds for better readability

    } catch (error) {
        console.error('Payment error:', error);
        setSubmitStatus({
            type: 'error',
            message: error.message || 'Registration failed. Please try again.',
            icon: '❌'
        });
    } finally {
        setIsSubmitting(false);
    }
};