"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userEmail = Cookies.get('userEmail');
    setIsLoggedIn(!!userEmail);
  }, []);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.title}>Camp Registration</h1>
          {/* <p style={styles.subtitle}>Registration</p> */}

          <div style={styles.buttonContainer}>
            {isLoggedIn ? (
              <Link href="/dash" style={styles.button}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" style={styles.button}>
                  Login
                </Link>
                <Link href="/signup" style={styles.buttonOutline}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Important Policies</h3>
            <div style={styles.policyLinks}>
              <Link href="/events/privacy-policy" style={styles.footerLink}>
                Privacy Policy
              </Link>
              <Link href="/events/terms-and-conditions" style={styles.footerLink}>
                Terms & Conditions
              </Link>
              <Link href="/events/shipping-policy" style={styles.footerLink}>
                Shipping Policy
              </Link>
              <Link href="/events/cancellation-refund-policy" style={styles.footerLink}>
                Cancellation & Refund
              </Link>
              <Link href="/events/pricing-policy" style={styles.footerLink}>
                Pricing Policy
              </Link>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© {new Date().getFullYear()} VOICE Pune. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f2f5',
  },
  container: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  content: {
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%',
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '32px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '32px',
    justifyContent: 'center',
  },
  button: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#0070f3',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    transition: 'background-color 0.2s',
  },
  buttonOutline: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#0070f3',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    border: '2px solid #0070f3',
    transition: 'all 0.2s',
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: '40px 20px 20px',
    borderTop: '1px solid #e5e7eb',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
  },
  footerSection: {
    textAlign: 'center',
  },
  footerTitle: {
    fontSize: '1.25rem',
    color: '#333',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  policyLinks: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  footerLink: {
    color: '#666',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
    ':hover': {
      color: '#0070f3',
    },
  },
  footerBottom: {
    marginTop: '20px',
    marginBottom: '1px',
    textAlign: 'center',
    color: '#666',
    fontSize: '0.9rem',
    borderTop: '1px solid #e5e7eb',
    // paddingTop: '20px',
  },
};
