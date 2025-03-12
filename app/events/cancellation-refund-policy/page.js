'use client';
import React from 'react';

const CancellationRefundPolicy = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Cancellation and Refund Policy</h1>
                <p className="text-sm text-gray-600 mb-8">Last Updated: {currentDate}</p>

                <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6">
                        At VOICE Pune, we understand that plans may change. Below is our refund policy:
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Cancellation by Participant</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">If you cancel 7 days before the event, you will receive a 50% refund.</li>
                            <li className="mb-2">No refunds will be processed for cancellations made within 7 days of the event start date.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Cancellation by Organizer</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">If VOICE Pune cancels the event due to unforeseen circumstances, you will receive a 100% refund.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Refund Processing</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">Refunds will be processed within 7-10 business days to the original payment method.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Contact for Cancellation Requests</h2>
                        <p className="text-gray-700">
                            To request a refund, please contact us at{' '}
                            <a
                                href="mailto:contact@voicepune.com"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                contact@voicepune.com
                            </a>
                            {' '}with your payment details.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CancellationRefundPolicy;
