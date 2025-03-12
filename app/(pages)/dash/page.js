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
            {/* <div className="news-ticker">
                <div className="ticker-wrapper">
                    <div className="ticker-content">
                        <p>📢 Note: Payment status will show as 'pending' until verified • All payments are verified within 1 week • Payment status will show as 'pending' until verified • All payments are verified within 1 week</p>
                    </div>
                </div>
            </div> */}

            <h1 style={styles.header}>My Registrations</h1>
            <p style={styles.email}>Email: {userEmail}</p>

            <div style={styles.buttonContainer} className="button-container">
                <button style={styles.button} className="action-button" onClick={() => router.push('/mem')}>
                    New Registration
                </button>
                <button
                    style={styles.button}
                    className="action-button"
                    onClick={() => {
                        Cookies.remove('userEmail');
                        router.push('/login');
                    }}
                >
                    Logout
                </button>
            </div>

            {registrations.length === 0 ? (
                <p style={styles.noData}>No registrations found.</p>
            ) : (
                <div style={styles.tableContainer} className="table-wrapper">
                    <table style={styles.table} className="responsive-table">
                        <thead>
                            <tr>
                                <th style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', fontSize: '13px', textAlign: 'center' }}>Date</th>

                                <th style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', fontSize: '13px', textAlign: 'center' }}>Participant Name</th>
                                <th style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', fontSize: '13px', textAlign: 'center' }}>Camp Name</th>
                                <th style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', fontSize: '13px', textAlign: 'center' }}>Accommodation</th>
                                <th style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', fontSize: '14px', textAlign: 'center' }}>Amount</th>
                                <th style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', fontSize: '13px', textAlign: 'center' }}>Payment Method</th>
                                <th style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', fontSize: '13px', textAlign: 'center' }}>Payment ID</th>
                                <th style={{ padding: '12px', backgroundColor: '#0070f3', color: '#fff', fontSize: '13px', textAlign: 'center' }}>Meal Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((reg) => (
                                <tr key={reg.id} style={styles.tableRow} className="table-row">
                                    <td style={styles.tableCell}>{formatDate(reg.createdAt)}</td>

                                    <td style={styles.tableCell}>{reg.participantName}</td>
                                    <td style={styles.td}>{reg.campName}</td>
                                    <td style={styles.td}>{reg.accommodation}</td>
                                    <td style={styles.td}>₹{reg.amount}</td>
                                    <td style={styles.tableCell}>
                                        {reg.paymentId ? 'Razorpay' : reg.deductionSource ? 'IDT' : ''}
                                    </td>
                                    <td style={styles.tableCell}>
                                        {reg.paymentId || ''}
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={styles.mealDetails} className="meal-details">
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

            <style jsx global>{`
                @media (max-width: 768px) {
                    .table-wrapper {
                        margin: 10px -5px;
                        border-radius: 6px;
                    }

                    .responsive-table {
                        font-size: 12px !important;
                    }

                    .responsive-table th,
                    .responsive-table td {
                        padding: 8px !important;
                        min-width: 100px;
                    }

                    .meal-details {
                        font-size: 11px !important;
                        line-height: 1.2;
                    }

                    .button-container {
                        flex-direction: column;
                        gap: 8px;
                    }

                    .action-button {
                        width: 100% !important;
                        padding: 8px !important;
                        font-size: 14px !important;
                    }

                    h1 {
                        font-size: 20px !important;
                        margin-bottom: 15px !important;
                    }

                    p {
                        font-size: 14px !important;
                    }

                    .accommodation-header,
                    .camp-header {
                        font-size: 11px !important;
                    }

                    .accommodation-cell,
                    .camp-cell {
                        font-size: 11px !important;
                    }

                    table th:nth-child(4),
                    table th:nth-child(5),
                    table td:nth-child(4),
                    table td:nth-child(5) {
                        font-size: 11px !important;
                        padding: 8px !important;
                    }
                }

                @media (max-width: 480px) {
                    .table-wrapper {
                        margin: 5px -2px;
                    }

                    .responsive-table {
                        font-size: 11px !important;
                    }

                    .responsive-table th,
                    .responsive-table td {
                        padding: 6px !important;
                        min-width: 80px;
                    }

                    .meal-details {
                        font-size: 10px !important;
                    }

                    .action-button {
                        padding: 7px !important;
                        font-size: 13px !important;
                    }

                    h1 {
                        font-size: 18px !important;
                    }

                    p {
                        font-size: 13px !important;
                    }

                    .accommodation-header,
                    .camp-header {
                        font-size: 10px !important;
                    }

                    .accommodation-cell,
                    .camp-cell {
                        font-size: 10px !important;
                    }

                    table th:nth-child(4),
                    table th:nth-child(5),
                    table td:nth-child(4),
                    table td:nth-child(5) {
                        font-size: 10px !important;
                        padding: 6px !important;
                    }
                }

                .table-wrapper {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                }

                .responsive-table {
                    white-space: nowrap;
                    border-collapse: separate;
                    border-spacing: 0;
                }

                .table-row {
                    transition: background-color 0.3s ease;
                }

                .table-row:hover {
                    background-color: #f9f9f9;
                }

                .button-container {
                    padding: 10px 0;
                }

                .action-button {
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .action-button:hover {
                    background-color: #0051cc !important;
                }

                .meal-details {
                    text-align: center;
                }

                .status-badge {
                    display: inline-block;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: 500;
                    text-transform: capitalize;
                }

                .status-badge.verifying {
                    background-color: #f0f0f0;
                    color: #666666;
                }

                .status-badge.processing {
                    background-color: #e8f4fd;
                    color: #0c5460;
                }

                .status-badge.reviewing {
                    background-color: #fff0e6;
                    color: #ad4e00;
                }

                .status-badge.done {
                    background-color: #d4edda;
                    color: #155724;
                }

                .status-badge.fail {
                    background-color: #f8d7da;
                    color: #721c24;
                }

                @media (max-width: 768px) {
                    .status-badge {
                        padding: 4px 8px;
                        font-size: 12px;
                    }
                }

                @media (max-width: 480px) {
                    .status-badge {
                        padding: 3px 6px;
                        font-size: 11px;
                    }
                }

                .news-ticker {
                    background-color: #002147;
                    color: white;
                    padding: 6px 0;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    margin: -20px -20px 20px -20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    overflow: hidden;
                    white-space: nowrap;
                }

                .ticker-wrapper {
                    display: inline-block;
                    white-space: nowrap;
                    padding-left: 100%;
                    animation: ticker 30s linear infinite;
                }

                .ticker-content {
                    display: inline-block;
                }

                .ticker-content p {
                    display: inline-block;
                    margin: 0;
                    padding-right: 50px;
                    font-size: 14px;
                    color: #fff;
                    font-weight: 500;
                }

                @keyframes ticker {
                    0% {
                        transform: translate3d(0, 0, 0);
                    }
                    100% {
                        transform: translate3d(-100%, 0, 0);
                    }
                }

                @media (max-width: 768px) {
                    .news-ticker {
                        margin: -10px -5px 15px -5px;
                        padding: 4px 0;
                    }

                    .ticker-content p {
                        font-size: 10px;
                    }
                }

                @media (max-width: 480px) {
                    .news-ticker {
                        margin: -5px -2px 12px -2px;
                        padding: 3px 0;
                    }

                    .ticker-content p {
                        font-size: 9px;
                    }
                }
            `}</style>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        '@media (max-width: 768px)': {
            padding: '10px 5px',
        },
        '@media (max-width: 480px)': {
            padding: '5px 2px',
        }
    },
    header: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
        fontSize: '24px',
        '@media (max-width: 768px)': {
            fontSize: '20px',
            marginBottom: '15px',
        },
        '@media (max-width: 480px)': {
            fontSize: '18px',
        }
    },
    email: {
        textAlign: 'center',
        color: '#555',
        marginBottom: '20px',
        '@media (max-width: 768px)': {
            fontSize: '14px',
            marginBottom: '15px',
        },
        '@media (max-width: 480px)': {
            fontSize: '13px',
        }
    },
    noData: {
        textAlign: 'center',
        color: '#777',
        '@media (max-width: 768px)': {
            fontSize: '14px',
        }
    },
    tableContainer: {
        width: '100%',
        overflowX: 'auto',
        marginBottom: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        '@media (max-width: 768px)': {
            marginBottom: '15px',
            borderRadius: '6px',
        }
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        '@media (max-width: 768px)': {
            display: 'block',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            WebkitOverflowScrolling: 'touch',
            fontSize: '12px',
        },
        '@media (max-width: 480px)': {
            fontSize: '11px',
        }
    },
    tableHeader: {
        backgroundColor: '#0070f3',
        color: '#fff',
        padding: '12px',
        textAlign: 'center',
        '@media (max-width: 768px)': {
            padding: '8px',
            minWidth: '100px',
        },
        '@media (max-width: 480px)': {
            padding: '6px',
            minWidth: '80px',
        }
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
        textAlign: 'center',
        borderBottom: '1px solid #ddd',
        '@media (max-width: 768px)': {
            padding: '8px',
            minWidth: '100px',
        },
        '@media (max-width: 480px)': {
            padding: '6px',
            minWidth: '80px',
        }
    },
    mealDetails: {
        fontSize: '0.7rem',
        lineHeight: '1.3',
        color: '#555',
        '@media (max-width: 768px)': {
            fontSize: '11px',
            lineHeight: '1.2',
        },
        '@media (max-width: 480px)': {
            fontSize: '10px',
        }
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '30px',
        marginTop: '10px',
        '@media (max-width: 768px)': {
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '20px',
        }
    },
    button: {
        padding: '12px 25px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#0070f3',
        color: '#fff',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        minWidth: '180px',
        '@media (max-width: 768px)': {
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            minWidth: 'auto',
        }
    },
    loading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#0070f3',
        marginTop: '50px',
        '@media (max-width: 768px)': {
            fontSize: '1rem',
            marginTop: '30px',
        },
        '@media (max-width: 480px)': {
            fontSize: '0.9rem',
            marginTop: '20px',
        }
    },
    error: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: 'red',
        marginTop: '50px',
        '@media (max-width: 768px)': {
            fontSize: '1rem',
            marginTop: '30px',
        },
        '@media (max-width: 480px)': {
            fontSize: '0.9rem',
            marginTop: '20px',
        }
    },
    smallerText: {
        fontSize: '13px',
        '@media (max-width: 768px)': {
            fontSize: '11px',
        },
        '@media (max-width: 480px)': {
            fontSize: '10px',
        }
    },
    td: {
        padding: '12px',
        textAlign: 'center',
        borderBottom: '1px solid #ddd',
        '@media (max-width: 768px)': {
            padding: '8px',
            minWidth: '100px',
        },
        '@media (max-width: 480px)': {
            padding: '6px',
            minWidth: '80px',
        }
    }
};

// Remove these since we're handling hover states in media queries
// styles.buttonHover = {
//     ...styles.button,
//     backgroundColor: '#005bb5',
// };
// styles.tableRowHover = {
//     ...styles.tableRow,
//     backgroundColor: '#f9f9f9',
// };