'use client'
import { useState } from 'react'
import styles from './contact.module.css'

export default function ContactUs() {
    const contactInfo = [
        {
            title: 'Email',
            info: 'info@voicepune.com',
            icon: '✉️'
        },

        {
            title: 'Address',
            info: 'VOICE Building, Sno 50, Near Kamal Nayan Bajaj Guest House, Katraj Kondhwa Bypass Road, Pune - 48',
            icon: '📍'
        },
        {
            title: 'Hours',
            info: 'Monday - Saturday: 9:00 AM - 6:00 PM',
            icon: '🕒'
        }
    ]

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Contact Us</h1>
            <p className={styles.description}>
                Have questions about our camps and events? We're here to help!
            </p>

            <div className={styles.contactGrid}>
                {contactInfo.map((item, index) => (
                    <div key={index} className={styles.contactCard}>
                        <span className={styles.contactIcon}>{item.icon}</span>
                        <h3 className={styles.contactTitle}>{item.title}</h3>
                        <p className={styles.contactInfo}>{item.info}</p>
                    </div>
                ))}
            </div>

            <div className={styles.additionalInfo}>
                <h2 className={styles.subtitle}>Get in Touch</h2>
                <p>
                    VOICE Pune welcomes your questions and inquiries about our educational and spiritual camps and events.
                    Whether you're interested in participating in our programs or would like to learn more about our community,
                    we're here to assist you.
                </p>
                <p>
                    For registration-related queries or specific event information,
                    please mention the event name when contacting us.
                </p>
            </div>


        </div>
    )
}