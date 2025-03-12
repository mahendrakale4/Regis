'use client';
import React from 'react';

const PrivacyPolicy = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                <p className="text-sm text-gray-600 mb-8">Last Updated: {currentDate}</p>

                <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6">
                        Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">Personal Information (Name, Email, Phone, etc.) when you register for an event.</li>
                            <li className="mb-2">Payment Information is securely processed by Razorpay; we do not store credit card details.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">To process event registrations.</li>
                            <li className="mb-2">To send event-related updates.</li>
                            <li className="mb-2">To improve our services.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Data Security</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">We use industry-standard security measures to protect your data.</li>
                            <li className="mb-2">We do not sell or share your personal information with third parties.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
