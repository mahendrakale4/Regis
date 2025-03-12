"use client";

import { useState } from 'react';

const VALID_PASSCODES = ['11', '22', '33', '44', '55'];

export function PaymentConfirmation({ onConfirm, onCancel, isSubmitting, entries, email, amount }) {
    const [deductionSource, setDeductionSource] = useState('');
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!deductionSource.trim()) {
            setError('VOICE Name /Dept from where to deduct Laxmi');
            return;
        }
        if (!VALID_PASSCODES.includes(passcode)) {
            setError('Invalid passcode');
            return;
        }
        onConfirm({
            entries,
            email,
            amount,
            paymentMethod: 'IDT',  // Specify IDT payment method
            deductionSource: deductionSource,
            passcode: passcode
        });
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <h3>Payment Confirmation</h3>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            VOICE Name/Dept (Deduction Source):
                            <input
                                type="text"
                                value={deductionSource}
                                onChange={(e) => setDeductionSource(e.target.value)}
                                required
                                autoComplete="off"
                                name="deductionSource-random"
                                style={styles.input}
                            />
                        </label>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            IDT Authorization Key:
                            <input
                                type="password"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                required
                                autoComplete="new-password"
                                name="passcode-random"
                                style={styles.input}
                            />
                        </label>
                    </div>
                    <div style={styles.buttonGroup}>
                        <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
                            {isSubmitting ? 'Processing...' : 'Confirm Payment'}
                        </button>
                        <button type="button" onClick={onCancel} disabled={isSubmitting} style={styles.cancelButton}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darkened background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popup: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto', // Ensures scroll if content overflows
        maxHeight: '80vh', // Restrict the height of the popup
    },
    error: {
        color: 'red',
        marginBottom: '10px',
        fontSize: '14px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        fontSize: '16px',
        marginBottom: '8px',
        display: 'block',
    },
    input: {
        width: '100%',
        padding: '12px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginBottom: '10px',
        boxSizing: 'border-box',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px', // Space between buttons
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        width: '48%', // Ensures buttons are of equal size
    },
    cancelButton: {
        backgroundColor: '#f44336',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        width: '48%', // Ensures buttons are of equal size
    },
};

