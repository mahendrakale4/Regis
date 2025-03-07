"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

export default function AllRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFields, setSelectedFields] = useState(['all']);
    const [showFieldSelector, setShowFieldSelector] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('pending');
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');
    const router = useRouter();
    const fieldSelectorRef = useRef(null);
    const statusFilterRef = useRef(null);

    const searchOptions = [
        { value: 'all', label: 'All' },
        { value: 'paymentId', label: 'Payment ID' },
        { value: 'paymentStatus', label: 'Payment Status' },
        { value: 'pocName', label: 'POC Name' },
        { value: 'pocContact', label: 'POC Contact' },
        { value: 'voiceName', label: 'VOICE Name' },
        { value: 'participantName', label: 'Participant Name' },
        { value: 'participantType', label: 'Participant Type' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'parentTemple', label: 'Parent Temple' },
        { value: 'counselorName', label: 'Counselor Name' },
        { value: 'campName', label: 'Camp Name' },
        { value: 'amount', label: 'Amount' },
        { value: 'emailId', label: 'Email' }
    ];

    useEffect(() => {
        fetchAllRegistrations();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
                setShowStatusFilter(false);
            }
            if (fieldSelectorRef.current && !fieldSelectorRef.current.contains(event.target)) {
                setShowFieldSelector(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
        const excelData = registrations.map(reg => ({
            'Date': new Date(reg.createdAt).toLocaleDateString(),
            'Payment ID': reg.paymentId || '',
            'Payment Status': reg.paymentStatus || '',
            'POC Name': reg.pocName,
            'Participant Name': reg.participantName,
            'Participant Type': reg.participantType,
            'Gender': reg.gender,
            'WhatsApp': reg.whatsapp,
            'POC Contact': reg.pocContact,
            'VOICE Name': reg.voiceName,
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
            'Deduction Source': reg.deductionSource,
            'Passcode': reg.passcode || ''
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
        XLSX.writeFile(wb, 'registrations.xlsx');
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleFieldToggle = (field) => {
        setSelectedFields(prev => {
            if (field === 'all') {
                return ['all'];
            }

            const newFields = prev.filter(f => f !== 'all');
            if (prev.includes(field)) {
                return newFields.filter(f => f !== field);
            } else {
                return [...newFields, field];
            }
        });
    };

    const handleStatusChange = async (registrationId, newStatus, paymentId) => {
        setSelectedRegistration(registrationId);
        setSelectedStatus(newStatus);
        setSelectedPaymentId(paymentId);
        setShowStatusModal(true);
    };

    const updatePaymentStatus = async () => {
        try {
            const response = await fetch('/api/update-payment-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentId: selectedPaymentId,
                    status: selectedStatus
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            const data = await response.json();

            // Update all registrations with the same paymentId
            setRegistrations(prevRegistrations =>
                prevRegistrations.map(reg =>
                    reg.paymentId === selectedPaymentId
                        ? { ...reg, paymentStatus: selectedStatus }
                        : reg
                )
            );

            setShowStatusModal(false);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const handleStatusFilterClick = () => {
        setShowStatusFilter(!showStatusFilter);
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
        setShowStatusFilter(false);
    };

    const filteredRegistrations = registrations.filter(reg => {
        const searchValue = searchTerm.trim();
        const matchesSearch = !searchValue ? true : selectedFields.includes('all') ?
            [
                reg.paymentId,
                reg.voiceName,
                reg.participantName,
                reg.participantType,
                reg.whatsapp,
                reg.pocName,
                reg.pocContact,
                reg.parentTemple,
                reg.counselorName,
                reg.campName,
                reg.emailId,
                reg.amount?.toString(),
                reg.paymentStatus
            ].some(field => field?.toString().toLowerCase().includes(searchValue))
            :
            selectedFields.some(field => {
                const fieldValue = reg[field];
                return fieldValue?.toString().toLowerCase().includes(searchValue);
            });

        // Apply status filter
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'null' && !reg.paymentStatus) ||
            (statusFilter === 'pending' && reg.paymentStatus === 'pending') ||
            reg.paymentStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="container">
            <h1>REGISTRATION TABLE</h1>

            <div className="controls">
                <div className="search-box">
                    <div className="search-field-selector" ref={fieldSelectorRef}>
                        <button
                            className="field-selector-btn"
                            onClick={() => setShowFieldSelector(!showFieldSelector)}
                        >
                            Select Fields
                        </button>
                        {showFieldSelector && (
                            <div className="field-selector-dropdown">
                                {searchOptions.map(option => (
                                    <label key={option.value} className="field-option">
                                        <input
                                            type="checkbox"
                                            checked={selectedFields.includes(option.value)}
                                            onChange={() => handleFieldToggle(option.value)}
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder={`Search in ${selectedFields.includes('all') ? 'all fields' : selectedFields.length + ' selected fields'}...`}
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>
                <div className="buttons">
                    <button onClick={downloadExcel} className="download-btn">
                        Download Excel
                    </button>
                    <button onClick={() => router.push('/dash')} className="dash-btn">
                        View My Registrations
                    </button>
                </div>
            </div>

            <div className="table-container">
                {filteredRegistrations.length === 0 ? (
                    <p className="no-data">No registrations found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Payment ID</th>
                                <th className="filter-header" ref={statusFilterRef}>
                                    <div className="header-content">
                                        Payment Status
                                        <button
                                            className="filter-button"
                                            onClick={handleStatusFilterClick}
                                        >
                                            ▼
                                        </button>
                                        {showStatusFilter && (
                                            <div className="filter-dropdown">
                                                <div
                                                    className={`filter-option ${statusFilter === 'all' ? 'selected' : ''}`}
                                                    onClick={() => handleStatusFilterChange('all')}
                                                >
                                                    All
                                                </div>

                                                <div
                                                    className={`filter-option ${statusFilter === 'pending' ? 'selected' : ''}`}
                                                    onClick={() => handleStatusFilterChange('pending')}
                                                >
                                                    Pending
                                                </div>
                                                <div
                                                    className={`filter-option ${statusFilter === 'done' ? 'selected' : ''}`}
                                                    onClick={() => handleStatusFilterChange('done')}
                                                >
                                                    Done
                                                </div>
                                                <div
                                                    className={`filter-option ${statusFilter === 'fail' ? 'selected' : ''}`}
                                                    onClick={() => handleStatusFilterChange('fail')}
                                                >
                                                    Fail
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </th>
                                <th>Action</th>
                                <th>VOICE Name</th>
                                <th>Participant Name</th>
                                <th>Participant Type</th>
                                <th>Gender</th>
                                <th>WhatsApp</th>
                                <th>POC Name</th>
                                <th>POC Contact</th>
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
                                <th>Passcode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.map((reg) => (
                                <tr key={reg.id}>
                                    <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                                    <td>{reg.paymentId || ''}</td>
                                    <td>
                                        {reg.paymentStatus && (
                                            <span className={`status-badge ${reg.paymentStatus.toLowerCase()}`}>
                                                {reg.paymentStatus}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {reg.paymentStatus ? (
                                            <select
                                                className="status-select"
                                                onChange={(e) => handleStatusChange(reg.id, e.target.value, reg.paymentId)}
                                                value={reg.paymentStatus}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="done">Done</option>
                                                <option value="fail">Fail</option>
                                            </select>
                                        ) : (
                                            <span className="status-locked"></span>
                                        )}
                                    </td>
                                    <td>{reg.voiceName}</td>
                                    <td>{reg.participantName}</td>
                                    <td>{reg.participantType}</td>
                                    <td>{reg.gender}</td>
                                    <td>{reg.whatsapp}</td>
                                    <td>{reg.pocName}</td>
                                    <td>{reg.pocContact}</td>
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
                                    <td>{reg.passcode || ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showStatusModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Confirm Status Update</h3>
                        <p>Are you sure you want to update the payment status to {selectedStatus}?</p>
                        <div className="modal-actions">
                            <button onClick={updatePaymentStatus} className="confirm-btn">
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .container {
                    padding: 20px;
                    max-width: 100%;
                    margin: 0 auto;
                }

                h1 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 30px;
                    font-size: 24px;
                }

                .controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    gap: 20px;
                }

                .search-box {
                    flex: 1;
                    max-width: 600px;
                    display: flex;
                    gap: 10px;
                    position: relative;
                }

                .search-field-selector {
                    position: relative;
                }

                .field-selector-btn {
                    padding: 10px 15px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    background: white;
                    cursor: pointer;
                    font-size: 14px;
                    white-space: nowrap;
                }

                .field-selector-btn:hover {
                    background: #f5f5f5;
                }

                .field-selector-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    padding: 10px;
                    z-index: 1000;
                    margin-top: 5px;
                    min-width: 200px;
                    max-height: 300px;
                    overflow-y: auto;
                }

                .field-option {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px;
                    cursor: pointer;
                }

                .field-option:hover {
                    background: #f5f5f5;
                }

                .search-input {
                    flex: 1;
                    padding: 10px 15px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                }

                .buttons {
                    display: flex;
                    gap: 10px;
                }

                .download-btn, .dash-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.3s;
                }

                .download-btn {
                    background-color: #4CAF50;
                    color: white;
                }

                .dash-btn {
                    background-color: #2196F3;
                    color: white;
                }

                .download-btn:hover {
                    background-color: #45a049;
                }

                .dash-btn:hover {
                    background-color: #1976D2;
                }

                .table-container {
                    overflow-x: auto;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    white-space: nowrap;
                }

                th, td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }

                th {
                    background-color: #f5f5f5;
                    font-weight: 600;
                    color: #333;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                }

                tr:hover {
                    background-color: #f8f9fa;
                }

                .loading {
                    text-align: center;
                    padding: 20px;
                    font-size: 18px;
                    color: #666;
                }

                .error {
                    color: #721c24;
                    background: #f8d7da;
                    padding: 15px;
                    border-radius: 4px;
                    margin: 20px 0;
                    text-align: center;
                }

                .no-data {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                    font-size: 16px;
                }

                .status-badge {
                    display: inline-block;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: 500;
                    text-transform: capitalize;
                }

                .status-badge.pending {
                    background-color: #f0f0f0;
                    color: #666666;
                }

                .status-badge.done {
                    background-color: #d4edda;
                    color: #155724;
                }

                .status-badge.fail {
                    background-color: #f8d7da;
                    color: #721c24;
                }

                .status-select {
                    padding: 6px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    background: white;
                    cursor: pointer;
                    font-size: 14px;
                }

                .status-locked {
                    padding: 6px 12px;
                    color: #666;
                    font-size: 14px;
                    font-style: italic;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .modal {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    max-width: 400px;
                    width: 100%;
                }

                .modal h3 {
                    color: #333;
                    margin-bottom: 10px;
                }

                .modal p {
                    margin-bottom: 20px;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }

                .confirm-btn, .cancel-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                }

                .confirm-btn {
                    background-color: #4CAF50;
                    color: white;
                }

                .cancel-btn {
                    background-color: #2196F3;
                    color: white;
                }

                .confirm-btn:hover {
                    background-color: #45a049;
                }

                .cancel-btn:hover {
                    background-color: #1976D2;
                }

                .filter-header {
                    position: relative;
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    gap: 0px;
                }

                .filter-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0 4px;
                    font-size: 12px;
                    color: #666;
                }

                .filter-button:hover {
                    color: #333;
                }

                .filter-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    z-index: 1000;
                    min-width: 120px;
                }

                .filter-option {
                    padding: 8px 12px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    font-size: 13px;
                }

                .filter-option:hover {
                    background-color: #f5f5f5;
                }

                .filter-option.selected {
                    background-color: #e3f2fd;
                    color: #1976d2;
                }

                @media (max-width: 768px) {
                    .container {
                        padding: 10px 5px;
                    }

                    h1 {
                        font-size: 20px;
                        margin-bottom: 15px;
                    }

                    .controls {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .search-box {
                        flex-direction: column;
                    }

                    .search-input, .field-selector-btn {
                        width: 100%;
                        font-size: 14px;
                        padding: 8px;
                    }

                    .buttons {
                        flex-direction: column;
                        gap: 8px;
                    }

                    .download-btn, .dash-btn, .theme-toggle-btn {
                        width: 100%;
                        font-size: 14px;
                        padding: 8px;
                    }

                    table {
                        display: block;
                        overflow-x: auto;
                        white-space: nowrap;
                        font-size: 12px;
                        -webkit-overflow-scrolling: touch;
                    }

                    th, td {
                        padding: 8px;
                        min-width: 100px;
                    }

                    .status-badge {
                        padding: 4px 6px;
                        font-size: 11px;
                    }

                    .status-select {
                        padding: 4px;
                        font-size: 12px;
                    }

                    .date-time {
                        font-size: 11px;
                    }

                    .time {
                        font-size: 10px;
                    }

                    .modal {
                        width: 90%;
                        padding: 15px;
                        margin: 10px;
                    }

                    .modal h3 {
                        font-size: 16px;
                    }

                    .modal p {
                        font-size: 14px;
                    }

                    .confirm-btn, .cancel-btn {
                        padding: 8px;
                        font-size: 14px;
                    }
                }

                @media (max-width: 480px) {
                    .container {
                        padding: 5px 2px;
                    }

                    h1 {
                        font-size: 18px;
                    }

                    table {
                        font-size: 11px;
                    }

                    th, td {
                        padding: 6px;
                        min-width: 80px;
                    }

                    .status-badge {
                        padding: 3px 5px;
                        font-size: 10px;
                    }

                    .date-time {
                        font-size: 10px;
                    }

                    .time {
                        font-size: 9px;
                    }
                }
            `}</style>
        </div>
    );
}