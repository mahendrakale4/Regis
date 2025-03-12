"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';

export function RazorpayPayment({ amount, onConfirm, onCancel, isSubmitting }) {
    const [error, setError] = useState(null);

    const initializeRazorpay = async () => {
        try {
            console.log('Amount received:', amount, 'Type:', typeof amount);

            // Enhanced amount validation
            const numericAmount = Number(amount);
            if (isNaN(numericAmount)) {
                throw new Error(`Amount must be a number, received: ${amount}`);
            }

            if (numericAmount <= 0) {
                throw new Error(`Amount must be greater than 0, received: ${numericAmount}`);
            }

            const amountInPaise = Math.round(numericAmount * 100);
            console.log('Amount in paise:', amountInPaise);

            const orderResponse = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amountInPaise,
                }),
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.error || 'Failed to create order');
            }

            const orderData = await orderResponse.json();
            console.log('Order created:', orderData);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amountInPaise,
                currency: "INR",
                name: "ISKCON Pune",
                description: "Camp Registration Payment",
                order_id: orderData.id,
                prefill: {
                    name: "",
                    email: "",
                    contact: "",
                },
                handler: function (response) {
                    console.log('Payment successful:', response);
                    onConfirm({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        paymentMethod: 'RAZORPAY'
                    });
                },
                modal: {
                    ondismiss: function () {
                        onCancel();
                    }
                },
                theme: {
                    color: "#0070f3",
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                setError(response.error.description);
                onCancel();
            });

            razorpay.open();
        } catch (error) {
            console.error('Razorpay initialization error:', error);
            setError(error.message);
            onCancel();
        }
    };

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
                onReady={() => {
                    if (window.Razorpay) {
                        initializeRazorpay();
                    } else {
                        setError('Failed to load Razorpay SDK');
                    }
                }}
                onError={() => setError('Failed to load Razorpay SDK')}
            />
            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}
            {isSubmitting && (
                <div style={styles.overlay}>
                    <div style={styles.loader}>Processing payment...</div>
                </div>
            )}
        </>
    );
}


const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loader: {
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    error: {
        color: '#dc2626',
        padding: '12px',
        marginBottom: '16px',
        backgroundColor: '#fef2f2',
        borderRadius: '4px',
        border: '1px solid #fee2e2',
    }
};