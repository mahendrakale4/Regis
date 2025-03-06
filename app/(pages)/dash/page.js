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

    if (loading) return <div style={styles.loading}>Loading...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Your Registrations</h1>
            <p style={styles.email}>Email: {userEmail}</p>

            {registrations.length === 0 ? (
                <p style={styles.noData}>No registrations found.</p>
            ) : (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeaderRow}>
                                <th style={styles.tableHeaderCell}>Date</th>
                                <th style={styles.tableHeaderCell}>POC Name</th>
                                <th style={styles.tableHeaderCell}>Participant Name</th>
                                <th style={styles.tableHeaderCell}>Camp Name</th>
                                <th style={styles.tableHeaderCell}>Accommodation</th>
                                <th style={styles.tableHeaderCell}>Amount</th>
                                <th style={styles.tableHeaderCell}>Deduction Source</th>
                                <th style={styles.tableHeaderCell}>Meals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((reg) => (
                                <tr key={reg.id} style={styles.tableRow}>
                                    <td style={styles.tableCell}>{formatDate(reg.createdAt)}</td>
                                    <td style={styles.tableCell}>{reg.pocName}</td>
                                    <td style={styles.tableCell}>{reg.participantName}</td>
                                    <td style={styles.tableCell}>{reg.campName}</td>
                                    <td style={styles.tableCell}>{reg.accommodation}</td>
                                    <td style={styles.tableCell}>₹{reg.amount}</td>
                                    <td style={styles.tableCell}>{reg.deductionSource}</td>
                                    <td style={styles.tableCell}>
                                        <div style={styles.mealDetails}>
                                            First: {reg.firstMealDate} ({reg.firstMealType})<br />
                                            Last: {reg.lastMealDate} ({reg.lastMealType})
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={() => router.push('/mem')}>
                    New Registration
                </button>
                <button
                    style={styles.button}
                    onClick={() => {
                        Cookies.remove('userEmail');
                        router.push('/login');
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    email: {
        textAlign: 'center',
        color: '#555',
        marginBottom: '20px',
    },
    noData: {
        textAlign: 'center',
        color: '#777',
    },
    tableContainer: {
        width: '100%',
        overflowX: 'auto',
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    tableHeaderRow: {
        backgroundColor: '#0070f3',
        color: '#fff',
    },
    tableHeaderCell: {
        padding: '12px',
        textAlign: 'left',
        fontWeight: 'bold',
        borderBottom: '2px solid #ddd',
    },
    tableRow: {
        transition: 'background-color 0.3s ease',
    },
    tableRowHover: {
        backgroundColor: '#f9f9f9',
    },
    tableCell: {
        padding: '12px',
        textAlign: 'left',
        borderBottom: '1px solid #ddd',
    },
    mealDetails: {
        fontSize: '0.7rem', // Smaller font size (14px if base is 16px)
        lineHeight: '1.3', // Adjust line height for better readability
        color: '#555', // Optional: Slightly lighter color for subtlety
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#0070f3',
        color: '#fff',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#005bb5',
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#0070f3',
        marginTop: '50px',
    },
    error: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: 'red',
        marginTop: '50px',
    },
};

// Add hover effect for buttons and table rows
styles.buttonHover = {
    ...styles.button,
    backgroundColor: '#005bb5',
};
styles.tableRowHover = {
    ...styles.tableRow,
    backgroundColor: '#f9f9f9',
};