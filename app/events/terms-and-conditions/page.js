'use client';
import React from 'react';

const TermsAndConditions = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
                <p className="text-sm text-gray-600 mb-8">Last Updated: {currentDate}</p>

                <div className="prose max-w-none">
                    <p className="text-gray-700 mb-6">
                        By accessing or using www.voicepune.com, you agree to comply with the following terms:
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. General Conditions</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">The camps and events are designed for educational and spiritual growth.</li>
                            <li className="mb-2">Participants must follow the event rules and guidelines provided at the time of registration.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Payment & Registration</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">Registration is confirmed only after successful payment.</li>
                            <li className="mb-2">We reserve the right to cancel or reschedule any event, in which case registered participants will be informed.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Conduct Policy</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">Participants must maintain decorum and follow the guidelines of our spiritual and educational events.</li>
                            <li className="mb-2">Misconduct may lead to removal from the event without a refund.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Liability Disclaimer</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li className="mb-2">VOICE Pune is not responsible for any personal loss, injury, or damage during the camp.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
