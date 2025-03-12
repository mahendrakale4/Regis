"use client";

import { useState, useEffect } from 'react';
import styles from './AllRegistrations.module.css';
import * as XLSX from 'xlsx';

export default function AllRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCell, setEditingCell] = useState({ id: null, field: null });
    const [editValue, setEditValue] = useState('');
    const [saveStatus, setSaveStatus] = useState({ show: false, success: false, message: '' });

    // All fields from the Registration model
    const fields = [
        'id',
        'emailId',
        'voiceName',
        'participantName',
        'whatsapp',
        'parentTemple',
        'counselorName',
        'campName',
        'firstMealDate',
        'firstMealType',
        'lastMealDate',
        'lastMealType',
        'dinnerType',
        'accommodation',
        'gender',
        'participantType',
        'age',
        'marriedSinceYear',
        'pocName',
        'pocContact',
        'paymentId',
        'deductionSource',
        'passcode',
        'createdAt',
        'amount'
    ];

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/registrations');
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

    const handleDownloadExcel = () => {
        try {
            // Format the data for Excel
            const excelData = registrations.map(reg => {
                const formattedReg = { ...reg };
                // Format createdAt date
                if (reg.createdAt) {
                    formattedReg.createdAt = new Date(reg.createdAt).toLocaleString();
                }
                return formattedReg;
            });

            // Create workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(excelData);

            // Add column widths
            const columnWidths = fields.map(field => ({ wch: Math.max(field.length, 15) }));
            worksheet['!cols'] = columnWidths;

            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

            // Generate Excel file and trigger download
            const today = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `registrations_${today}.xlsx`);

            setSaveStatus({
                show: true,
                success: true,
                message: 'Excel file downloaded successfully!'
            });

            setTimeout(() => {
                setSaveStatus({ show: false, success: false, message: '' });
            }, 3000);
        } catch (err) {
            setSaveStatus({
                show: true,
                success: false,
                message: 'Failed to download Excel file: ' + err.message
            });
        }
    };

    const handleEdit = (id, field, value) => {
        setEditingCell({ id, field });
        setEditValue(value || '');
        setSaveStatus({ show: false, success: false, message: '' });
    };

    const handleSave = async (id) => {
        try {
            const registration = registrations.find(r => r.id === id);
            const updatedData = {
                ...registration,
                [editingCell.field]: editValue
            };

            const response = await fetch(`/api/registrations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Failed to update registration');
            }

            const updatedRegistration = await response.json();
            setRegistrations(registrations.map(r =>
                r.id === id ? updatedRegistration : r
            ));
            setEditingCell({ id: null, field: null });
            setSaveStatus({ show: true, success: true, message: 'Successfully updated!' });

            setTimeout(() => {
                setSaveStatus({ show: false, success: false, message: '' });
            }, 3000);
        } catch (err) {
            setSaveStatus({ show: true, success: false, message: 'Failed to save changes: ' + err.message });
        }
    };

    const handleKeyPress = (e, id) => {
        if (e.key === 'Enter') {
            handleSave(id);
        } else if (e.key === 'Escape') {
            setEditingCell({ id: null, field: null });
            setSaveStatus({ show: false, success: false, message: '' });
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading registrations...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>All Registrations</h1>
                <button
                    onClick={handleDownloadExcel}
                    className={styles.downloadButton}
                >
                    Download as Excel
                </button>
            </div>
            {saveStatus.show && (
                <div className={`${styles.alert} ${saveStatus.success ? styles.success : styles.error}`}>
                    {saveStatus.message}
                </div>
            )}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {fields.map(field => (
                                <th key={field}>{field}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((registration) => (
                            <tr key={registration.id}>
                                {fields.map((field) => (
                                    <td key={field}
                                        onClick={() => field !== 'id' && field !== 'createdAt' ?
                                            handleEdit(registration.id, field, registration[field]) : null}
                                        className={`
                                            ${field !== 'id' && field !== 'createdAt' ? styles.editableCell : ''}
                                            ${editingCell.id === registration.id && editingCell.field === field ? styles.activeCell : ''}
                                        `}>
                                        {editingCell === registration.id && editingCell.field === field ? (
                                        // {editingCell.id === registration.id && editingCell.field === field ? (
                                            <div className={styles.editContainer}>
                                                <input
                                                    type={field === 'age' || field === 'amount' ||
                                                        field === 'firstMealDate' || field === 'lastMealDate' ||
                                                        field === 'marriedSinceYear' ? 'number' : 'text'}
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyDown={(e) => handleKeyPress(e, registration.id)}
                                                    className={styles.editInput}
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleSave(registration.id)}
                                                    className={styles.saveButton}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <span>
                                                {field === 'createdAt'
                                                    ? new Date(registration[field]).toLocaleString()
                                                    : registration[field]}
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
