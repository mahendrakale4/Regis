"use client";

import { useState, useEffect } from "react";
import calculateCost from "./cost.js";
import { proceedToPayment } from './proceedToPayment.js';
import { PaymentConfirmation } from './PaymentConfirmation';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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
    });
    const [editIndex, setEditIndex] = useState(null);
    const [pocEntered, setPocEntered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [email, setUserEmail] = useState(null);
    const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handlePocChange(e) {
        setPocDetails({ ...pocDetails, [e.target.name]: e.target.value });
    }

    function savePocDetails() {
        if (!pocDetails.pocName || !pocDetails.pocContact) {
            alert("Please enter POC Name and Contact.");
            return;
        }
        setPocEntered(true);
    }

    function addEntry() {
        if (!formData.voiceName || !formData.counselorName || !formData.campName || !formData.firstMealDate || !formData.firstMealType || !formData.lastMealDate || !formData.lastMealType || !formData.accommodation || !formData.gender) {
            alert("Please fill in required fields.");
            return;
        }
        if (formData.firstMealDate >= formData.lastMealDate) {
            alert("First meal date should be before last meal date.");
            return;
        }
        const newEntry = { ...formData, ...pocDetails, email: email };

        if (editIndex !== null) {
            const updatedEntries = [...entries];
            updatedEntries[editIndex] = newEntry;
            setEntries(updatedEntries);
            setEditIndex(null);
        } else {
            setEntries([...entries, newEntry]);
        }

        setFormData({
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
            dinnerType: "Dinner Meal",
            accommodation: "",
            gender: "",
        });
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
            return total + calculateCost(entry.firstMealDate, entry.firstMealType, entry.lastMealDate, entry.lastMealType, entry.accommodation);
        }, 0);
    };

    const handlePayment = () => {
        setShowPaymentConfirmation(true);
    };

    const handlePaymentConfirm = ({ deductionSource, passcode }) => {
        proceedToPayment(
            entries,
            email,
            calculateTotalCost,
            setIsSubmitting,
            setSubmitStatus,
            setPocEntered,
            setEntries,
            setPocDetails,
            deductionSource,
            passcode
        );
        setShowPaymentConfirmation(false);
    };

    if (!mounted) {
        return null;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Registration Portal</h2>
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={() => router.push('/dash')}>
                    View My Registrations
                </button>
            </div>

            <p style={styles.infoText}>Hare Krsna ! You can add multiple registration entries in one transaction.</p>

            {submitStatus && (
                <div style={styles.statusMessage}>
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
                        type="number"
                        name="pocContact"
                        value={pocDetails.pocContact}
                        onChange={handlePocChange}
                        maxLength={10}  // Limit input to 10 characters
                        pattern="\d{10}"  // Ensure exactly 10 digits are entered
                        inputMode="numeric"  // Mobile numeric keypad
                        onInput={(e) => {
                            // Restrict to only numbers, and limit to 10 characters
                            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                        }}
                        placeholder="Enter 10-digit number"

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
                    <label>Gender:</label>
                    <select
                        style={styles.select}
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <br />
                    <label>Whatsapp:</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        maxLength={10}  // Limit input to 10 characters
                        pattern="\d{10}"  // Regex pattern to ensure only numbers are entered
                        inputMode="numeric"  // Triggers numeric keypad on mobile devices
                        onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                    />
                    <br />
                    <label>Parent Temple:</label>
                    <input
                        style={styles.input}
                        type="text"
                        name="parentTemple"
                        value={formData.parentTemple}
                        onChange={handleChange}
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
                    <label>Camp Name:</label>
                    <select
                        style={styles.select}
                        name="campName"
                        value={formData.campName}
                        onChange={handleChange}
                    >
                        <option value="">Select Camp</option>
                        <option value="GS Camp- First Time">GS (18 - 20 april)</option>
                        <option value="GS Camp- Attended Before">NS (18 - 20 april)</option>
                        <option value="Volunteers">Brahmachari</option>
                        <option value="Brahmachari">Brahmachari</option>
                    </select>
                    <br />
                    <label>First Meal Date:</label>
                    <select
                        style={styles.select}
                        name="firstMealDate"
                        value={formData.firstMealDate}
                        onChange={handleChange}
                    >
                        <option value="">Select Date</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                    </select>
                    <br />
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
                    <br />
                    <label>Last Meal Date:</label>
                    <select
                        style={styles.select}
                        name="lastMealDate"
                        value={formData.lastMealDate}
                        onChange={handleChange}
                    >
                        <option value="">Select Last Meal Date</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                    </select>
                    <br />
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
                    <br />
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
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    <br />
                    <button style={styles.button} onClick={addEntry}>
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
                                        <td style={styles.td}>{entry.gender}</td>
                                        <td style={styles.td}>{entry.counselorName}</td>
                                        <td style={styles.td}>
                                            {entry.firstMealDate} - {entry.firstMealType}
                                        </td>
                                        <td style={styles.td}>
                                            {entry.lastMealDate} - {entry.lastMealType}
                                        </td>
                                        <td style={styles.td}>{entry.campName}</td>
                                        <td style={styles.td}>{entry.accommodation}</td>
                                        <td style={styles.td}>
                                            ₹{calculateCost(entry.firstMealDate, entry.firstMealType, entry.lastMealDate, entry.lastMealType, entry.accommodation)}
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.actionButtonsContainer}>
                                                <button style={styles.actionButton} onClick={() => editEntry(index)}>Edit</button>
                                                <button style={styles.actionButton} onClick={() => deleteEntry(index)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h3>Total Cost: ₹{calculateTotalCost()}</h3>

                    <button
                        style={styles.button}
                        onClick={handlePayment}
                        disabled={isSubmitting || entries.length === 0}
                    >
                        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                </div>
            )}

            {mounted && showPaymentConfirmation && (
                <PaymentConfirmation
                    onConfirm={handlePaymentConfirm}
                    onCancel={() => setShowPaymentConfirmation(false)}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}


const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Arial', sans-serif",
    },
    header: {
        textAlign: "center",
        fontSize: "24px",
        marginBottom: "20px",
    },
    buttonContainer: {
        textAlign: "center",
        marginBottom: "20px",
    },
    button: {
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "10px 20px",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
        fontSize: "16px",
    },
    infoText: {
        textAlign: "center",
        fontSize: "16px",
        marginBottom: "20px",
    },
    statusMessage: {
        backgroundColor: "#e8f5e9",
        color: "#388e3c",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "20px",
    },
    pocForm: {
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: "#f4f4f4",
        borderRadius: "5px",
    },
    pocDetails: {
        marginBottom: "20px",
        fontSize: "16px",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderRadius: "5px",
    },
    registrationForm: {
        marginBottom: "20px",
        padding: "20px",
        backgroundColor: "#fafafa",
        borderRadius: "5px",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "16px",
    },
    select: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "16px",
    },
    entriesList: {
        marginBottom: "20px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
        border: "2px solid #ddd", // Thicker table borders
    },
    th: {
        padding: "12px",
        backgroundColor: "#f2f2f2",
        textAlign: "left",
        fontWeight: "bold",
        border: "2px solid #ddd", // Thicker borders for headers
    },
    td: {
        padding: "10px",
        border: "2px solid #ddd", // Thicker borders for data cells
        textAlign: "center",
    },
    actionButton: {
        backgroundColor: "#f44336",
        color: "#fff",
        padding: "5px 10px",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
        fontSize: "12px", // Smaller button size
    },
    actionButtonsContainer: {
        display: "flex",
        justifyContent: "space-between", // Space between buttons
        gap: "10px", // Adds spacing between buttons
    },
    tableContainer: {
        overflowX: "auto", // Make table scrollable on mobile
        marginBottom: "20px",
    },
    mobileTableContainer: {
        display: "block", // For mobile
        overflowX: "auto",
    },
};