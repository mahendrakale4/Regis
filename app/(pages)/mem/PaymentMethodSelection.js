export function PaymentMethodSelection({ onSelectMethod, onCancel }) {
    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <div style={styles.header}>
                    <h3 style={styles.title}>Select Payment Method</h3>
                    <button
                        onClick={onCancel}
                        style={styles.closeButton}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                <div style={styles.methodContainer}>
                    <button
                        onClick={() => onSelectMethod('upi')}
                        style={styles.methodButton}
                        className="upi-button"
                    >
                        <span style={styles.upiIcon}>₹</span>
                        <div style={styles.methodInfo}>
                            <span style={styles.methodName}>UPI Payment</span>
                            <span style={styles.methodDesc}>Pay using any UPI app</span>
                        </div>
                    </button>
                    <button
                        onClick={() => onSelectMethod('idt')}
                        style={styles.methodButton}
                        className="idt-button"
                    >
                        <span style={styles.idtIcon}>📝</span>
                        <div style={styles.methodInfo}>
                            <span style={styles.methodName}>IDT Payment</span>
                            <span style={styles.methodDesc}>Internal deduction transfer</span>
                        </div>
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .upi-button:hover, .idt-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                @media (max-width: 480px) {
                    .upi-button, .idt-button {
                        padding: 12px 15px !important;
                    }
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
        padding: '24px',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    title: {
        margin: 0,
        fontSize: '20px',
        color: '#333',
        fontWeight: '600',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        color: '#666',
        cursor: 'pointer',
        padding: '0 8px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        ':hover': {
            backgroundColor: '#f0f0f0',
            color: '#333',
        }
    },
    methodContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    methodButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        padding: '15px 20px',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
    },
    upiIcon: {
        fontSize: '24px',
        backgroundColor: '#6366f1',
        color: 'white',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    idtIcon: {
        fontSize: '24px',
        backgroundColor: '#22c55e',
        color: 'white',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    methodInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    methodName: {
        fontWeight: '500',
        color: '#333',
    },
    methodDesc: {
        fontSize: '13px',
        color: '#666',
    },
}; 