"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

export default function AllRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchAllRegistrations();
    }, []);

    const fetchAllRegistrations = async () => {
        try {
            const response = await fetch('/api/all-registrations');
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

    const downloadExcel = () => {
        // Prepare data for Excel
        const excelData = registrations.map(reg => ({
            'Date': new Date(reg.createdAt).toLocaleDateString(),
            'POC Name': reg.pocName,
            'POC Contact': reg.pocContact,
            'VOICE Name': reg.voiceName,
            'Participant Name': reg.participantName,
            'Gender': reg.gender,
            'WhatsApp': reg.whatsapp,
            'Parent Temple': reg.parentTemple,
            'Counselor Name': reg.counselorName,
            'Camp Name': reg.campName,
            'First Meal Date': reg.firstMealDate,
            'First Meal Type': reg.firstMealType,
            'Last Meal Date': reg.lastMealDate,
            'Last Meal Type': reg.lastMealType,
            'Dinner Type': reg.dinnerType,
            'Accommodation': reg.accommodation,
            'Amount': reg.amount,
            'Email': reg.emailId,
            'Deduction Source': reg.deductionSource
        }));

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

        // Save file
        XLSX.writeFile(wb, 'registrations.xlsx');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>REGISTRATION TABLE</h2>
            <div style={{ margin: '20px 0' }}>
                <button onClick={downloadExcel}>Download Excel</button>
                <button onClick={() => router.push('/dash')} style={{ marginLeft: '10px' }}>
                    View My Registrations
                </button>
            </div>

            {registrations.length === 0 ? (
                <p>No registrations found.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>POC Name</th>
                            <th>POC Contact</th>
                            <th>VOICE Name</th>
                            <th>Participant Name</th>
                            <th>Gender</th>
                            <th>WhatsApp</th>
                            <th>Parent Temple</th>
                            <th>Counselor Name</th>
                            <th>Camp Name</th>
                            <th>First Meal Date</th>
                            <th>First Meal Type</th>
                            <th>Last Meal Date</th>
                            <th>Last Meal Type</th>
                            <th>Dinner Type</th>
                            <th>Accommodation</th>
                            <th>Amount</th>
                            <th>Email</th>
                            <th>Deduction Source</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((reg) => (
                            <tr key={reg.id}>
                                <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                                <td>{reg.pocName}</td>
                                <td>{reg.pocContact}</td>
                                <td>{reg.voiceName}</td>
                                <td>{reg.participantName}</td>
                                <td>{reg.gender}</td>
                                <td>{reg.whatsapp}</td>
                                <td>{reg.parentTemple}</td>
                                <td>{reg.counselorName}</td>
                                <td>{reg.campName}</td>
                                <td>{reg.firstMealDate}</td>
                                <td>{reg.firstMealType}</td>
                                <td>{reg.lastMealDate}</td>
                                <td>{reg.lastMealType}</td>
                                <td>{reg.dinnerType}</td>
                                <td>{reg.accommodation}</td>
                                <td>₹{reg.amount}</td>
                                <td>{reg.emailId}</td>
                                <td>{reg.deductionSource}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <style jsx>{`
                .status-message {
                    padding: 10px;
                    margin: 10px 0;
                    border-radius: 4px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    overflow-x: auto;
                    display: block;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                    border: 1px solid #ddd;
                    min-width: 100px;
                }
                th {
                    background-color: #f4f4f4;
                }
                button {
                    padding: 8px 16px;
                    margin-right: 10px;
                    cursor: pointer;
                }
                h2 {
                    margin-bottom: 20px;
                }
            `}</style>
        </div>
    );
}