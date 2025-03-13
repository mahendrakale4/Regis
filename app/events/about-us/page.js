import styles from './about.module.css'
import Image from 'next/image'

export default function AboutUs() {

    const companyValues = [
        {
            title: 'Transparency',
            description: 'We maintain clear and transparent pricing and registration processes for all participants',
            icon: '🔍'
        },
        {
            title: 'Integrity',
            description: 'We are committed to maintaining the highest standards of ethical conduct in all our camps and events',
            icon: '⭐'
        },
        {
            title: 'Growth',
            description: 'We believe in continuous evolution of individuals and the importance of lifelong learning',
            icon: '🌱'
        },
        {
            title: 'Community',
            description: 'We foster a sense of belonging and connection, where everyone is encouraged to support each other',
            icon: '🤝'
        }
    ]

    const offerings = [
        {
            title: 'Educational Excellence',
            description: 'Carefully designed events combining personal growth and educational insights',
            icon: '📚'
        },
        {
            title: 'Spiritual Development',
            description: 'Programs focused on mindfulness and spiritual growth',
            icon: '🕊️'
        },
        {
            title: 'Easy Registration',
            description: 'Convenient online registration process with prompt confirmation',
            icon: '✅'
        },
        {
            title: 'Dedicated Support',
            description: 'Continuous assistance and guidance throughout your journey with us',
            icon: '💪'
        }
    ]

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <h1 className={styles.title}>Welcome to VOICE Pune</h1>
                <p className={styles.subtitle}>
                    Creating transformative experiences through educational and spiritual camps and events
                </p>
            </section>

            {/* Who We Are Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Who We Are</h2>
                <div className={styles.whoWeAre}>
                    <p>
                        VOICE Pune is a community-driven organization that brings together people who are passionate about learning and evolving. Our camps and events are carefully curated to foster growth in various areas, including education, spirituality, personal development, and mindfulness.
                    </p>
                    <p>
                        We believe in the power of shared experiences and the importance of community, which is why we design our programs to be both impactful and accessible to people of all backgrounds. Our goal is to provide an enriching environment where individuals can learn, grow, and connect with others on their personal journeys.
                    </p>
                </div>
            </section>

            {/* Values Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Our Values</h2>
                <div className={styles.valuesGrid}>
                    {companyValues.map((value, index) => (
                        <div key={index} className={styles.valueCard}>
                            <span className={styles.valueIcon}>{value.icon}</span>
                            <h3 className={styles.valueTitle}>{value.title}</h3>
                            <p className={styles.valueDescription}>{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* What We Offer Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>What We Offer</h2>
                <div className={styles.offeringsGrid}>
                    {offerings.map((offering, index) => (
                        <div key={index} className={styles.offeringCard}>
                            <span className={styles.offeringIcon}>{offering.icon}</span>
                            <h3 className={styles.offeringTitle}>{offering.title}</h3>
                            <p className={styles.offeringDescription}>{offering.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Get Involved Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Get Involved</h2>
                <div className={styles.getInvolved}>
                    <p>
                        We invite you to join us on this incredible journey of learning and growth. Explore our upcoming camps and events and register today to start your transformative experience with VOICE Pune.
                    </p>
                    <div className={styles.cta}>
                        <a href="/dash" className={styles.ctaButton}>
                            Explore Our Events
                        </a>
                        <a href="/events/contact-us" className={styles.ctaButton}>
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>


        </div>
    )
}
