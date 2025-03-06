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
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Hare Krsna </h1>
        <p style={styles.subtitle}>Registration</p>

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
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
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
};
