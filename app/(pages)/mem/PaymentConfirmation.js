"use client";

import { useState } from 'react';

const VALID_PASSCODES = ['11', '22', '33', '44', '55'];

export function PaymentConfirmation({ onConfirm, onCancel, isSubmitting }) {
    const [deductionSource, setDeductionSource] = useState('');
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!deductionSource.trim()) {
            setError('VOICE Name /Dept from where to deduct Laxmi');
            return;
        }
        if (!VALID_PASSCODES.includes(passcode)) {
            setError('Invalid passcode');
            return;
        }
        onConfirm({ deductionSource, passcode });
    };

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid black'
        }}>
            <h3>Payment Confirmation</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} autoComplete="off">
                <div>
                    <label>
                        VOICE Name/Dept (Deduction Source):
                        <input
                            type="text"
                            value={deductionSource}
                            onChange={(e) => setDeductionSource(e.target.value)}
                            required
                            autoComplete="off"
                            name="deductionSource-random"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        IDT Authorization Key:
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            required
                            autoComplete="new-password"
                            name="passcode-random"
                        />
                    </label>
                </div>
                <div>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Confirm Payment'}
                    </button>
                    <button type="button" onClick={onCancel} disabled={isSubmitting}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
} 