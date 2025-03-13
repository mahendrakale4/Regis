"use client";

import { useState, useEffect } from "react";
import calculateCost from "./cost.js";
import { proceedToPayment } from './proceedToPayment.js';
import { PaymentConfirmation } from './PaymentConfirmation';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { PaymentMethodSelection } from './PaymentMethodSelection';
import { RazorpayPayment } from "./RazorpayPayment";



export default function BulkRegistration() {
    const [entries, setEntries] = useState([]);
    const [pocDetails, setPocDetails] = useState({
        pocName: "",
        pocContact: "",
    });
    const [formData, setFormData] = useState({
        voiceName: "",
        participantName: "",
        whatsapp: "",
        parentTemple: "",
        counselorName: "",
        campName: "",
        firstMealDate: "",
        firstMealType: "",
        lastMealDate: "",
        lastMealType: "",
        dinnerType: "",
        accommodation: "",
        gender: "",
        participantType: "",
        age: "",
        marriedSinceYear: "",
    });
    const [editIndex, setEditIndex] = useState(null);
    const [pocEntered, setPocEntered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [email, setUserEmail] = useState(null);
    const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
    const [showPaymentMethodSelection, setShowPaymentMethodSelection] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const userEmail = Cookies.get("userEmail");
        if (userEmail) {
            setUserEmail(userEmail);
        }
    }, []);

    function handleChange(e) {
        if (e.target.name === 'campName' && e.target.value !== "NS Camp - Attended Before") {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
                marriedSinceYear: "" // Clear marriedSinceYear if camp is not NS Camp - Attended Before
            });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    }

    function handlePocChange(e) {
        const { name, value } = e.target;
        if (name === 'pocContact') {
            // Only allow digits for the contact number
            const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
            setPocDetails({ ...pocDetails, [name]: numericValue });
        } else {
            // Allow any text for the name
            setPocDetails({ ...pocDetails, [name]: value });
        }
    }

    function savePocDetails() {
        if (!pocDetails.pocName || !pocDetails.pocContact || pocDetails.pocContact.length !== 10) {
            alert("Please enter POC Name and a valid 10-digit Contact number.");
            return;
        }
        setPocEntered(true);
    }

    function addEntry() {
        if (!formData.voiceName || !formData.age || !formData.campName || !formData.firstMealDate || !formData.firstMealType || !formData.lastMealDate || !formData.lastMealType || !formData.accommodation || !formData.gender || !formData.participantType) {
            alert("Please fill in required fields.");
            return;
        }
        if (formData.campName === "NS Camp - Attended Before" && !formData.marriedSinceYear) {
            alert("Please enter Marriage Year - it is required for NS Camp - Attended Before");
            return;
        }
        if (formData.firstMealDate >= formData.lastMealDate) {
            alert("First meal date should be before last meal date.");
            return;
        }
        if (formData.whatsapp && formData.whatsapp.length !== 10) {
            alert("WhatsApp number must be exactly 10 digits.");
            return;
        }
        const newEntry = { ...formData, ...pocDetails, email: email };

        if (editIndex !== null) {
            const updatedEntries = [...entries];
            updatedEntries[editIndex] = newEntry;
            setEntries(updatedEntries);
            setEditIndex(null);
            setSubmitStatus({
                type: 'success',
                message: 'Entry updated successfully! You can add more entries or scroll down to check your entries.',
            });
        } else {
            setEntries([...entries, newEntry]);
            setSubmitStatus({
                type: 'success',
                message: 'Entry added successfully! You can add more entries or scroll down to check your entries.',
            });
        }

        setFormData({
            voiceName: formData.voiceName,
            parentTemple: formData.parentTemple,
            counselorName: formData.counselorName,
            participantName: "",
            whatsapp: "",
            campName: "",
            firstMealDate: "",
            firstMealType: "",
            lastMealDate: "",
            lastMealType: "",
            dinnerType: "Dinner Meal",
            accommodation: "",
            gender: "",
            participantType: "",
            age: "",
            marriedSinceYear: "",
        });

        setTimeout(() => {
            setSubmitStatus(null);
        }, 5000);
    }

    function editEntry(index) {
        const entry = entries[index];
        setFormData(entry);
        setEditIndex(index);
    }

    function deleteEntry(index) {
        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);
    }

    const calculateTotalCost = () => {
        return entries.reduce((total, entry) => {
            return total + calculateCost(
                entry.firstMealDate,
                entry.firstMealType,
                entry.lastMealDate,
                entry.lastMealType,
                entry.accommodation,
                entry.participantType
            );
        }, 0);
    };

    const handlePayment = () => {
        setShowPaymentMethodSelection(true);
    };

    const handlePaymentMethodSelect = (method) => {
        setShowPaymentMethodSelection(false);
        setSelectedPaymentMethod(method);
        if (method === 'idt') {
            setShowPaymentConfirmation(true);
        }
    };


    const handlePaymentCancel = () => {
        setShowPaymentMethodSelection(false);
        setSelectedPaymentMethod(null);
        setShowPaymentConfirmation(false);
    };

    const handlePaymentConfirm = async (paymentDetails) => {
        setIsSubmitting(true);
        try {
            // Add validation for IDT payment
            if (paymentDetails.paymentMethod === 'IDT' && (!paymentDetails.deductionSource || !paymentDetails.passcode)) {
                throw new Error('Please provide both deduction source and passcode for IDT payment');
            }

            // Update entries with passcode for IDT payments
            const updatedEntries = entries.map(entry => ({
                ...entry,
                deductionSource: paymentDetails.deductionSource,
                passcode: paymentDetails.passcode
            }));

            console.log('Sending verification request with:', {
                ...paymentDetails,
                entries: updatedEntries, // Use updated entries with passcode
                email,
                amount: calculateTotalCost()
            });

            const response = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...paymentDetails,
                    entries: updatedEntries,
                    email,
                    amount: calculateTotalCost()
                }),
            });

            const data = await response.json();
            console.log('Verification response:', data);

            if (response.ok) {
                setSubmitStatus({
                    type: 'success',
                    message: 'Registration successful! Thank you for your payment.',
                    icon: '✅'
                });
                // Clear form
                setEntries([]);
                setPocEntered(false);
                setPocDetails({
                    pocName: "",
                    pocContact: "",
                });
                // Redirect to dashboard after successful payment
                router.push('/dash');
            } else {
                throw new Error(data.error || 'Payment verification failed');
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            setSubmitStatus({
                type: 'error',
                message: `Payment verification failed: ${error.message}`,
                icon: '❌'
            });
        } finally {
            setIsSubmitting(false);
            setSelectedPaymentMethod(null);
            setShowPaymentConfirmation(false);
        }
    };

    const getStatusMessageStyles = (status) => ({
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "20px",
        textAlign: "center",
        backgroundColor: status?.type === 'success' ? "#e8f5e9" :
            status?.type === 'error' ? "#ffebee" :
                status?.type === 'info' ? "#e3f2fd" : "#e8f5e9",
        color: status?.type === 'success' ? "#2e7d32" :
            status?.type === 'error' ? "#c62828" :
                status?.type === 'info' ? "#1565c0" : "#2e7d32",
    });

    if (!mounted) {
        return null;
    }

    return (
        <div style={styles.container}>
            <h3 style={styles.header}>Registration Portal</h3>
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={() => router.push('/dash')}>
                    View My Registrations
                </button>
            </div>
            <p style={styles.infoText}>Hare Krsna ! You can add multiple registration entries in one transaction.</p>


            {submitStatus && (
                <div style={getStatusMessageStyles(submitStatus)}>
                    {submitStatus.message}
                </div>
            )}

            {!pocEntered ? (
                <div style={styles.pocForm}>
                    <label>POC Name:</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="pocName"
                        value={pocDetails.pocName}
                        onChange={handlePocChange}
                    />
                    <br />
                    <label>POC Contact no:</label>
                    <input
                        style={styles.input}
                        type="tel"
                        name="pocContact"
                        value={pocDetails.pocContact}
                        onChange={handlePocChange}
                        minLength={10}
                        maxLength={10}
                        pattern="[0-9]{10}"
                        placeholder="Enter 10-digit number"
                        required
                    />
                    <br />
                    <button style={styles.button} onClick={savePocDetails}>
                        Save POC Details
                    </button>
                </div>
            ) : (
                <div style={styles.pocDetails}>
                    <p><strong>POC Name:</strong> {pocDetails.pocName}</p>
                    <p><strong>POC Contact:</strong> {pocDetails.pocContact}</p>
                </div>
            )}

            {pocEntered && (
                <div style={styles.registrationForm}>
                    <label>Parent Temple:</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="parentTemple"
                        value={formData.parentTemple}
                        onChange={handleChange}
                    />
                    <br />
                    <label>Voice Name:</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="voiceName"
                        value={formData.voiceName}
                        onChange={handleChange}
                    />
                    <br />
                    <label>Participant Name:</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="participantName"
                        value={formData.participantName}
                        onChange={handleChange}
                    />
                    <br />
                    <div style={styles.twoColumnContainer}>
                        <div style={styles.column}>
                            <label>Gender:</label>
                            <select
                                style={styles.input}
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div style={styles.column}>
                            <label>Age:</label>
                            <input
                                style={styles.input}
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                min="0"
                                max="150"
                            />
                        </div>
                    </div>
                    <label>Camp Name:</label>
                    <select
                        style={styles.select}
                        name="campName"
                        value={formData.campName}
                        onChange={handleChange}
                    >
                        <option value="">Select Camp</option>
                        <option value="GS Camp - 1st Timer">GS Camp - 1st Timer</option>
                        <option value="GS Camp - Attended Before">GS Camp - Attended Before</option>
                        <option value="GS Camp - About to Join PDC">GS Camp - About to Join PDC</option>
                        <option value="NS Camp - 1sTimer">NS Camp - 1sTimer</option>
                        <option value="NS Camp - Attended Before">NS Camp - Attended Before</option>
                        <option value="NS Camp -Attended Before">Brahmachari</option>
                    </select>
                    <br />
                    <div style={styles.twoColumnContainer}>
                        {formData.campName === "NS Camp - Attended Before" && (
                            <div style={styles.column}>
                                <label>Married Since (Year):</label>
                                <input
                                    style={styles.input}
                                    type="number"
                                    name="marriedSinceYear"
                                    value={formData.marriedSinceYear}
                                    onChange={handleChange}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    placeholder="Enter year of marriage"
                                    required
                                />
                            </div>
                        )}
                        <div style={styles.column}>
                            <label>Participant Type:</label>
                            <select
                                style={styles.select}
                                name="participantType"
                                value={formData.participantType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Participant Type</option>
                                <option value="Camp Participant">Camp Participant</option>
                                <option value="Mentor">Mentor</option>
                                <option value="Volunteer">Volunteer</option>
                                <option value="Brahmachari">Brahmachari</option>
                            </select>
                        </div>
                    </div>
                    <label>Whatsapp:</label>
                    <input
                        style={styles.input}
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                            handleChange({ target: { name: 'whatsapp', value } });
                        }}
                        minLength={10}
                        maxLength={10}
                        pattern="[0-9]{10}"
                        placeholder="Enter 10-digit WhatsApp number"
                    />
                    <br />

                    <label>Counselor Name:</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="counselorName"
                        value={formData.counselorName}
                        onChange={handleChange}
                    />
                    <br />

                    <div style={styles.mealDateContainer}>
                        <div style={styles.mealRow}>
                            <div style={styles.mealColumn}>
                                <label>First Meal Date:</label>
                                <select
                                    style={styles.select}
                                    name="firstMealDate"
                                    value={formData.firstMealDate}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Date</option>
                                    <option value="14">14 - April</option>
                                    <option value="15">15 - April</option>
                                    <option value="16">16 - April</option>
                                    <option value="17">17 - April</option>
                                    <option value="18">18 - April</option>
                                    <option value="19">19 - April</option>
                                    <option value="20">20 - April</option>
                                    <option value="21">21 - April</option>
                                    <option value="22">22 - April</option>
                                </select>
                            </div>
                            <div style={styles.mealColumn}>
                                <label>First Meal Type:</label>
                                <select
                                    style={styles.select}
                                    name="firstMealType"
                                    value={formData.firstMealType}
                                    onChange={handleChange}
                                >
                                    <option value="">Choose Meal Type</option>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.mealRow}>
                            <div style={styles.mealColumn}>
                                <label>Last Meal Date:</label>
                                <select
                                    style={styles.select}
                                    name="lastMealDate"
                                    value={formData.lastMealDate}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Last Meal Date</option>
                                    <option value="15">15 - April</option>
                                    <option value="16">16 - April</option>
                                    <option value="17">17 - April</option>
                                    <option value="18">18 - April</option>
                                    <option value="19">19 - April</option>
                                    <option value="20">20 - April</option>
                                    <option value="21">21 - April</option>
                                    <option value="22">22 - April</option>
                                    <option value="23">23 - April</option>
                                </select>
                            </div>
                            <div style={styles.mealColumn}>
                                <label>Last Meal Type:</label>
                                <select
                                    style={styles.select}
                                    name="lastMealType"
                                    value={formData.lastMealType}
                                    onChange={handleChange}
                                >
                                    <option value="">Choose Meal Type</option>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <label>Dinner Type:</label>
                    <select
                        style={styles.select}
                        name="dinnerType"
                        value={formData.dinnerType}
                        onChange={handleChange}
                    >
                        <option value="Dinner Meal">Dinner Meal</option>
                        <option value="Only Milk">Only Milk</option>
                    </select>
                    <br />
                    <label>Accommodation:</label>
                    <select
                        style={styles.select}
                        name="accommodation"
                        value={formData.accommodation}
                        onChange={handleChange}
                    >
                        <option value="">Select Accommodation</option>
                        <option value="Yes">Yes , I need accomodation from CV</option>
                        <option value="No">No , I dont need accomodation</option>
                    </select>
                    <br />
                    <button
                        style={isSubmitting ? styles.disabledButton : styles.button}
                        onClick={addEntry}
                        disabled={isSubmitting}
                    >
                        {editIndex !== null ? "Update Entry" : "Add Entry"}
                    </button>
                </div>
            )}

            {entries.length > 0 && (
                <div style={styles.entriesList}>
                    <h3>Added Entries</h3>
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Full Name</th>
                                    <th style={styles.th}>Gender</th>
                                    <th style={styles.th}>Age</th>
                                    <th style={styles.th}>Counselor Name</th>
                                    <th style={styles.th}>First Meal</th>
                                    <th style={styles.th}>Last Meal</th>
                                    <th style={styles.th}>Camp Name</th>
                                    <th style={styles.th}>Accommodation</th>
                                    <th style={styles.th}>Cost</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry, index) => (
                                    <tr key={index}>
                                        <td style={styles.td}>{entry.participantName}</td>
                                        <td style={{ ...styles.td, fontSize: '13px' }}>{entry.gender}</td>
                                        <td style={styles.td}>{entry.age}</td>

                                        <td style={styles.td}>{entry.counselorName}</td>
                                        <td style={styles.td}>
                                            {entry.firstMealDate} - {entry.firstMealType}
                                        </td>
                                        <td style={styles.td}>
                                            {entry.lastMealDate} - {entry.lastMealType}
                                        </td>
                                        <td style={{ ...styles.td, fontSize: '13px' }}>{entry.campName}</td>
                                        <td style={styles.td}>{entry.accommodation}</td>
                                        <td style={styles.td}>
                                            ₹{calculateCost(
                                                entry.firstMealDate,
                                                entry.firstMealType,
                                                entry.lastMealDate,
                                                entry.lastMealType,
                                                entry.accommodation,
                                                entry.participantType
                                            )}
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.actionButtonsContainer}>
                                                <button
                                                    style={{
                                                        ...styles.actionButton,
                                                        ...styles.editButton,
                                                        opacity: isSubmitting ? 0.7 : 1
                                                    }}
                                                    onClick={() => editEntry(index)}
                                                    disabled={isSubmitting}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    style={{
                                                        ...styles.actionButton,
                                                        ...styles.deleteButton,
                                                        opacity: isSubmitting ? 0.7 : 1
                                                    }}
                                                    onClick={() => deleteEntry(index)}
                                                    disabled={isSubmitting}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h3>Total Cost: ₹{calculateTotalCost()}</h3>

                    <button
                        style={isSubmitting ? styles.disabledButton : styles.button}
                        onClick={handlePayment}
                        disabled={isSubmitting || entries.length === 0}
                    >
                        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                </div>
            )}

            {mounted && showPaymentMethodSelection && (
                <PaymentMethodSelection
                    onSelectMethod={handlePaymentMethodSelect}
                    onCancel={handlePaymentCancel}
                />
            )}

            {mounted && selectedPaymentMethod === 'upi' && (
                <RazorpayPayment
                    amount={calculateTotalCost()}
                    onConfirm={async (paymentDetails) => {
                        setIsSubmitting(true);
                        try {
                            const response = await fetch('/api/verify-payment', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    ...paymentDetails,
                                    entries,
                                    email,
                                    amount: calculateTotalCost(),
                                }),
                            });

                            const data = await response.json();

                            if (response.ok) {
                                setSubmitStatus({
                                    type: 'success',
                                    message: 'Payment successful! Your registration is complete.',
                                    icon: '✅'
                                });
                                setEntries([]);
                                setPocEntered(false);
                                setPocDetails({
                                    pocName: "",
                                    pocContact: "",
                                });
                                // Optionally redirect to dashboard
                                router.push('/dash');
                            } else {
                                throw new Error(data.error || 'Payment verification failed');
                            }
                        } catch (error) {
                            console.error('Payment verification error:', error);
                            setSubmitStatus({
                                type: 'error',
                                message: 'Payment verification failed. Please contact support.',
                                icon: '❌'
                            });
                        } finally {
                            setIsSubmitting(false);
                            setSelectedPaymentMethod(null);
                        }
                    }}
                    onCancel={handlePaymentCancel}
                    isSubmitting={isSubmitting}
                />
            )}

            {mounted && showPaymentConfirmation && selectedPaymentMethod === 'idt' && (
                <PaymentConfirmation
                    onConfirm={handlePaymentConfirm}
                    onCancel={handlePaymentCancel}
                    isSubmitting={isSubmitting}
                    entries={entries}
                    email={email}
                    amount={calculateTotalCost()}
                />
            )}
        </div>
    );
}


const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "16px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    header: {
        textAlign: "center",
        fontSize: "22px",
        marginBottom: "16px",
        color: "#333",
        fontWeight: "600",
    },
    buttonContainer: {
        textAlign: "center",
        marginBottom: "20px",
    },
    button: {
        backgroundColor: "#0070f3",
        color: "#fff",
        padding: "8px 16px",
        border: "none",
        cursor: "pointer",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "500",
    },
    infoText: {
        textAlign: "center",
        fontSize: "14px",
        marginBottom: "16px",
        color: "#666",
        padding: "12px",
        backgroundColor: "#f5f5f5",
        borderRadius: "6px",
    },
    statusMessage: {
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "20px",
        textAlign: "center",
        backgroundColor: "#e8f5e9",  // default success background
        color: "#2e7d32",  // default success text color
    },
    pocForm: {
        marginBottom: "16px",
        padding: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
    },
    input: {
        width: "calc(100% - 16px)", // Adjust width to account for padding
        padding: "8px",
        marginBottom: "12px",
        borderRadius: "4px",
        border: "1px solid #ddd",
        fontSize: "14px",
        boxSizing: "border-box", // Ensure padding doesn't affect width
    },
    select: {
        width: "100%",
        padding: "8px",
        marginBottom: "4px",
        borderRadius: "4px",
        border: "1px solid #ddd",
        fontSize: "14px",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
    },
    registrationForm: {
        marginBottom: "16px",
        padding: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "16px",
        border: "1px solid #e0e0e0",
    },
    th: {
        padding: "10px",
        backgroundColor: "#f5f5f5",
        textAlign: "left",
        fontWeight: "600",
        fontSize: "13px",
        color: "#444",
        borderBottom: "1px solid #e0e0e0",
    },
    td: {
        padding: "10px",
        borderBottom: "1px solid #e0e0e0",
        fontSize: "13px",
        color: "#333",
    },
    actionButton: {
        padding: "6px 12px",
        border: "none",
        cursor: "pointer",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "500",
        backgroundColor: "#f0f0f0", // Light grey background
        color: "#666", // Darker grey text
        border: "1px solid #ddd",
    },
    editButton: {
        backgroundColor: "#e8e8e8",
        color: "#444",
        "&:hover": {
            backgroundColor: "#ddd",
        }
    },
    deleteButton: {
        backgroundColor: "#e8e8e8",
        color: "#444",
        "&:hover": {
            backgroundColor: "#ddd",
        }
    },
    actionButtonsContainer: {
        display: "flex",
        gap: "6px",
    },
    label: {
        display: "block",
        marginBottom: "6px",
        fontSize: "13px",
        fontWeight: "500",
        color: "#555",
    },
    tableContainer: {
        overflowX: "auto",
        marginBottom: "16px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
    },
    disabledButton: {
        backgroundColor: "#f0f0f0",
        color: "#999",
        cursor: "not-allowed",
        opacity: 0.7,
    },
    pocDetails: {
        fontSize: "14px",
        padding: "0px 0px 0px 12px",
        backgroundColor: "#f8f8f8",
        borderRadius: "4px",
        border: "1px solid #e0e0e0",
        marginBottom: "8px",
        display: "flex",
        gap: "12px",
    },
    entriesList: {
        marginBottom: "16px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "16px",
        border: "1px solid #e0e0e0",
    },
    mealDateContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "12px",
    },
    mealRow: {
        display: "flex",
        gap: "8px",
    },
    mealColumn: {
        flex: 1,
    },
    twoColumnContainer: {
        display: "flex",
        gap: "8px",
        marginBottom: "12px",
    },
    column: {
        flex: 1,
    },
    '@media screen and (maxWidth: 768px)': {
        // styles for tablets
        container: {
            padding: '12px',
        },
        table: {
            fontSize: '12px',
        },
    },
    '@media screen and (maxWidth: 480px)': {
        // styles for mobile
        container: {
            padding: '8px',
        },
        table: {
            fontSize: '11px',
        },
    },
};