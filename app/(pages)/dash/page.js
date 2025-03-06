"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Dashboard() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const email = Cookies.get('userEmail');
        if (!email) {
            router.push('/login');
            return;
        }
        setUserEmail(email);
        fetchRegistrations(email);
    }, []);

    const fetchRegistrations = async (email) => {
        try {
            const response = await fetch(`/api/user-registrations?email=${email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch registrations');
            }
            const data = await response.json();
            setRegistrations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Your Registrations</h1>
            <p>Email: {userEmail}</p>

            {registrations.length === 0 ? (
                <p>No registrations found.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>POC Name</th>
                            <th>Participant Name</th>
                            <th>Camp Name</th>
                            <th>Accommodation</th>
                            <th>Amount</th>
                            <th>Deduction Source</th>
                            <th>Meals</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((reg) => (
                            <tr key={reg.id}>
                                <td>{formatDate(reg.createdAt)}</td>
                                <td>{reg.pocName}</td>
                                <td>{reg.participantName}</td>
                                <td>{reg.campName}</td>
                                <td>{reg.accommodation}</td>
                                <td>₹{reg.amount}</td>
                                <td>{reg.deductionSource}</td>
                                <td>
                                    First: {reg.firstMealDate} ({reg.firstMealType})<br />
                                    Last: {reg.lastMealDate} ({reg.lastMealType})
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div style={{ marginTop: '20px' }}>
                <button onClick={() => router.push('/mem')}>
                    New Registration
                </button>
                <button onClick={() => {
                    Cookies.remove('userEmail');
                    router.push('/login');
                }}>
                    Logout
                </button>
            </div>
        </div>
    );
} 