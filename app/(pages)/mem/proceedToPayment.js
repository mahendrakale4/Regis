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
    setSubmitStatus({ type: 'info', message: 'Processing your registration...' });

    try {
        const response = await fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                entries,
                totalAmount: calculateTotalCost(),
                emailId: email,
                deductionSource,
                passcode
            }),
        });

        console.log("Email being sent:", email);
        console.log("Complete payload:", {
            entries,
            emailId: email
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        setSubmitStatus({
            type: 'success',
            message: 'Registration successful! Payment processed.'
        });

        // Clear form after successful submission
        setTimeout(() => {
            setEntries([]);
            setPocEntered(false);
            setPocDetails({
                pocName: "",
                pocContact: "",
            });
            setSubmitStatus(null);
        }, 3000);

    } catch (error) {
        console.error('Payment error:', error);
        setSubmitStatus({
            type: 'error',
            message: `Registration failed: ${error.message}`
        });
    } finally {
        setIsSubmitting(false);
    }
};