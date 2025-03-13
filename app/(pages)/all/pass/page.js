"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AllPasswords() {
    const [registrations, setRegistrations] = useState([]); // Stores user registration data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchAllUser();
    }, []);

    // Fetch users from the API endpoint
    const fetchAllUser = async () => {
        try {
            const response = await fetch("/api/all-user");
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            const data = await response.json();
            console.log(data);
            setRegistrations(data); // Store user data in state
        } catch (err) {
            setError(err.message); // Set error if any
        } finally {
            setLoading(false); // Stop loading
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>USER TABLE</h2>

            {registrations.length === 0 ? (
                <p>No registrations found.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Created At</th>
                            <th>Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((reg) => (
                            <tr key={reg.id}>
                                <td>{reg.id}</td>
                                <td>{reg.email}</td>
                                <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                                <td>{reg.password}</td>
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
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
                th,
                td {
                    padding: 12px;
                    text-align: left;
                    border: 1px solid #ddd;
                    min-width: 120px;
                }
                th {
                    background-color: #f4f4f4;
                    font-weight: 600;
                }
                tr:hover {
                    background-color: #f5f5f5;
                }
                button {
                    padding: 6px 12px;
                    margin-right: 10px;
                    cursor: pointer;
                    background-color: #0070f3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                }
                button:hover {
                    background-color: #0051b3;
                }
                h2 {
                    margin-bottom: 20px;
                    color: #333;
                    font-size: 24px;
                }
            `}</style>
        </div>
    );
}
