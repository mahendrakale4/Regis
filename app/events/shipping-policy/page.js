'use client';
import React from 'react';

const ShippingPolicy = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipping Policy</h1>
                <p className="text-sm text-gray-600 mb-8">Last Updated: {currentDate}</p>

                <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6">
                        At VOICE Pune, we offer various camps and events, which do not involve physical shipping.
                        Instead, upon successful registration and payment, participants receive a confirmation email
                        with event details.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Digital Confirmation</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">Once the payment is received, you will receive an email confirmation within 24 hours.</li>
                            <li className="mb-2">The confirmation email will include camp details, schedules, and any required instructions.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Contact Us</h2>
                        <p className="text-gray-700">
                            For any issues regarding event confirmation, please contact us at{' '}
                            <a
                                href="mailto:contact@voicepune.com"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                contact@voicepune.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
