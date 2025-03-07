import { useState } from 'react';

export function UPIPayment({ amount, onConfirm, onCancel, isSubmitting }) {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = () => {
        setShowConfirmation(true);
    };

    const handleConfirmPayment = () => {
        onConfirm();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <div style={styles.header}>
                    <h3 style={styles.title}>{!showConfirmation ? 'UPI Payment' : 'Confirm Payment'}</h3>
                    <button
                        onClick={onCancel}
                        style={styles.closeButton}
                        aria-label="Close"
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                </div>

                {!showConfirmation ? (
                    <div style={styles.content}>
                        <div style={styles.amountBadge}>
                            <span style={styles.currencySymbol}>₹</span>
                            <span style={styles.amount}>{amount}</span>
                        </div>

                        <div style={styles.qrContainer}>
                            <img
                                src="/upi-qr.jpeg"
                                alt="UPI QR Code"
                                style={styles.qrCode}
                            />
                        </div>

                        <div style={styles.infoBox}>
                            <div style={styles.infoIcon}>ℹ️</div>
                            <p style={styles.note}>
                                Payment will be marked as 'Verifying' until confirmed by our team
                                <br />
                                {/* <span style={styles.subNote}>Usually takes 24-48 hours</span> */}
                            </p>
                        </div>

                        <div style={styles.buttonGroup}>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                style={styles.submitButton}
                            >
                                {isSubmitting ? 'Processing...' : 'I have completed the payment'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={styles.confirmation}>
                        <div style={styles.confirmIcon}>✓</div>
                        <h4 style={styles.confirmTitle}>Confirm Your Payment</h4>
                        <p style={styles.confirmText}>Have you completed the UPI payment of <strong>₹{amount}</strong>?</p>
                        <p style={styles.note}>You'll receive a payment ID for tracking after confirmation</p>

                        <div style={styles.buttonGroup}>
                            <button
                                onClick={handleConfirmPayment}
                                disabled={isSubmitting}
                                style={styles.confirmButton}
                            >
                                {isSubmitting ? 'Processing...' : 'Yes, Confirm Payment'}
                            </button>
                            <button
                                onClick={() => setShowConfirmation(false)}
                                disabled={isSubmitting}
                                style={styles.backButton}
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `}</style>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(3px)',
    },
    popup: {
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '10px',
        width: '80%',
        maxWidth: '320px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
        animation: 'fadeIn 0.3s ease-out',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    title: {
        margin: 0,
        fontSize: '18px',
        color: '#333',
        fontWeight: '600',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        color: '#666',
        cursor: 'pointer',
        padding: '0 6px',
        borderRadius: '50%',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
    },
    amountBadge: {
        backgroundColor: '#f0f9ff',
        padding: '8px 16px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
    },
    currencySymbol: {
        fontSize: '18px',
        color: '#0284c7',
        fontWeight: '500',
    },
    amount: {
        fontSize: '24px',
        color: '#0284c7',
        fontWeight: '600',
    },
    qrContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '14px',
        border: '1px dashed #e0e0e0',
        borderRadius: '10px',
        backgroundColor: '#fafafa',
    },
    qrCode: {
        width: '170px',
        height: '170px',
        padding: '6px',
        backgroundColor: 'white',
        borderRadius: '6px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    scanText: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: '#666',
        fontSize: '13px',
    },
    scanIcon: {
        fontSize: '16px',
    },
    infoBox: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '10px 14px',
        backgroundColor: '#fff8e6',
        borderRadius: '8px',
        marginTop: '6px',
    },
    infoIcon: {
        fontSize: '16px',
    },
    note: {
        margin: 0,
        color: '#92400e',
        fontSize: '13px',
        lineHeight: '1.3',
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        marginTop: '6px',
    },
    submitButton: {
        backgroundColor: '#0284c7',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    confirmation: {
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
    },
    confirmIcon: {
        fontSize: '28px',
        width: '56px',
        height: '56px',
        backgroundColor: '#22c55e',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '6px',
        animation: 'pulse 2s infinite',
    },
    confirmTitle: {
        margin: '0',
        fontSize: '18px',
        color: '#333',
        fontWeight: '600',
    },
    confirmText: {
        margin: '0',
        color: '#666',
        fontSize: '14px',
    },
    confirmButton: {
        backgroundColor: '#22c55e',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: '100%',
    },
    backButton: {
        backgroundColor: 'transparent',
        color: '#666',
        padding: '10px',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: '100%',
    },
}; 