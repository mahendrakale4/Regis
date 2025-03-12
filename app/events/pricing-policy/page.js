'use client';
import React from 'react';

const PricingPolicy = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Pricing Policy</h1>
                <p className="text-sm text-gray-600 mb-8">Last Updated: {currentDate}</p>

                <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6">
                        At VOICE Pune, we maintain transparency in pricing for our camps and events.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Pricing Structure</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">The prices for camps are displayed on our website and are subject to change without prior notice.</li>
                            <li className="mb-2">The final price at checkout includes applicable taxes and fees.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Offers & Discounts</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">We may offer special discounts or early-bird pricing for certain events.</li>
                            <li className="mb-2">Discount codes (if any) must be applied before checkout.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Payment Methods</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">We accept payments through Razorpay, including:</li>
                            <ul className="list-circle pl-6">
                                <li>UPI</li>
                                <li>Net Banking</li>
                                <li>Debit/Credit Cards</li>
                                <li>Wallets</li>
                            </ul>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PricingPolicy;
