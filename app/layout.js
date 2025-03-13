export const metadata = {
  title: 'Registration Portal',
  description: 'Registration portal for VOICE camps and events',
  icons: {
    icon: '/favicon.png', // Path relative to the public directory
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}



