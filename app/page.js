// app/layout.js
import React from 'react';
import './globals.css';  // Global CSS (if applicable)

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* You can add meta tags, title, and other head elements here */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My Application</title>
      </head>
      <body>
        {/* You can add global components like a header, footer, or sidebar here */}
        <header>
          <h1>My Application</h1>
        </header>
        <main>{children}</main>
        <footer>Footer Content</footer>
      </body>
    </html>
  );
}
