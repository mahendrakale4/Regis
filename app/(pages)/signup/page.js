"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from 'js-cookie';

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }
      Cookies.set('userEmail', email, { expires: 7 });
      router.push("/dash");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Sign Up</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </label>
          </div>
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link href="/login" style={styles.linkText}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  box: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#0070f3',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  link: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#555',
  },
  linkText: {
    color: '#0070f3',
    textDecoration: 'none',
  },
};

export default SignupPage;