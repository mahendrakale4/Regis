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
        if (!formData.voiceName || !formData.counselorName || !formData.campName || !formData.firstMealDate || !formData.firstMealType || !formData.lastMealDate || !formData.lastMealType || !formData.accommodation) {
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
        <div>
            <h2>BULK REGISTRATION PORTAL</h2>
            <div>
                <button onClick={() => router.push('/dash')}>
                    View My Registrations
                </button>
            </div>
            <p>Welcome! You can add multiple registration entries in one transaction.</p>

            {submitStatus && (
                <div className={`status-message ${submitStatus.type}`}>
                    {submitStatus.message}
                </div>
            )}

            {!pocEntered ? (
                <div>
                    <label>Point of Contact (POC) Name:</label>
                    <input type="text" name="pocName" value={pocDetails.pocName} onChange={handlePocChange} /><br />

                    <label>POC Contact:</label>
                    <input type="text" name="pocContact" value={pocDetails.pocContact} onChange={handlePocChange} /><br />

                    <button onClick={savePocDetails}>Save POC Details</button>
                </div>
            ) : (
                <div>
                    <p><strong>POC Name:</strong> {pocDetails.pocName}</p>
                    <p><strong>POC Contact:</strong> {pocDetails.pocContact}</p>
                </div>
            )}

            {pocEntered && (
                <div>
                    <label>VOICE Name:</label>
                    <input type="text" name="voiceName" value={formData.voiceName} onChange={handleChange} /><br />

                    <label>Participant Name:</label>
                    <input type="text" name="participantName" value={formData.participantName} onChange={handleChange} /><br />

                    <label>Whatsapp:</label>
                    <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} /><br />

                    <label>Parent Temple:</label>
                    <input type="text" name="parentTemple" value={formData.parentTemple} onChange={handleChange} /><br />

                    <label>Counselor Name:</label>
                    <input type="text" name="counselorName" value={formData.counselorName} onChange={handleChange} /><br />

                    <label>Camp Name:</label>
                    <select name="campName" value={formData.campName} onChange={handleChange}>
                        <option value="">Select Camp</option>
                        <option value="Nishtha">Nishtha (26 Dec-30 Dec)</option>
                        <option value="Ashray">Ashray (26 Dec-30Dec)</option>
                        <option value="GS Camp- First Time">GS Camp(23Dec-25Dec) - First Time</option>
                        <option value="GS Camp- Attended Before">GS Camp(23 Dec-25 Dec) - Attended Before</option>
                        <option value="GS Camp- Joining PDC 2024">GS Camp(23 Dec-25 Dec) - Joining PDC 2024</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Brahmachari">Brahmachari</option>
                    </select><br />

                    <label>First Meal Date:</label>
                    <select name="firstMealDate" value={formData.firstMealDate} onChange={handleChange}>
                        <option value="">Select Date</option>
                        <option value="21">21</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                    </select>

                    <select name="firstMealType" value={formData.firstMealType} onChange={handleChange}>
                        <option value="">Choose Meal Type</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                    </select><br />

                    <label>Last Meal Date:</label>
                    <select name="lastMealDate" value={formData.lastMealDate} onChange={handleChange}>
                        <option value="">Select last Meal Date</option>
                        <option value="22">22</option>
                        <option value="23">23</option>
                        <option value="24">24</option>
                        <option value="25">25</option>
                        <option value="26">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                    </select>

                    <select name="lastMealType" value={formData.lastMealType} onChange={handleChange}>
                        <option value="">Choose Meal Type</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                    </select><br />

                    <label>Dinner Type:</label>
                    <select name="dinnerType" value={formData.dinnerType} onChange={handleChange}>
                        <option value="Dinner Meal">Dinner Meal</option>
                        <option value="Only Milk">Only Milk</option>
                    </select><br />

                    <label>Accommodation:</label>
                    <select name="accommodation" value={formData.accommodation} onChange={handleChange}>
                        <option value="">Select Accommodation</option>
                        <option value="AC">AC</option>
                        <option value="Non AC">Non AC</option>
                        <option value="CV Floor">CV Floor</option>
                    </select><br />

                    <button onClick={addEntry}>{editIndex !== null ? "Update Entry" : "Add Entry"}</button>
                </div>
            )}

            {entries.length > 0 && (
                <div>
                    <h3>Added Entries</h3>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Counselor Name</th>
                                <th>First Meal</th>
                                <th>Last Meal</th>
                                <th>Camp Name</th>
                                <th>Accommodation</th>
                                <th>Cost</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.participantName}</td>
                                    <td>{entry.counselorName}</td>
                                    <td>{entry.firstMealDate} - {entry.firstMealType}</td>
                                    <td>{entry.lastMealDate} - {entry.lastMealType}</td>
                                    <td>{entry.campName}</td>
                                    <td>{entry.accommodation}</td>
                                    <td>₹{calculateCost(entry.firstMealDate, entry.firstMealType, entry.lastMealDate, entry.lastMealType, entry.accommodation)}</td>
                                    <td>
                                        <button onClick={() => editEntry(index)}>Edit</button>
                                        <button onClick={() => deleteEntry(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3>Total Cost: ₹{calculateTotalCost()}</h3>

                    <button
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
            <style jsx>{`
                .status-message {
                    padding: 10px;
                    margin: 10px 0;
                    border-radius: 4px;
                }
                .info {
                    background-color: #e0f7fa;
                    color: #006064;
                }
                .success {
                    background-color: #e8f5e9;
                    color: #1b5e20;
                }
                .error {
                    background-color: #ffebee;
                    color: #b71c1c;
                }
            `}</style>
        </div>
    );
}