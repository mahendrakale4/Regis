// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`${geistSans.variable} ${geistMono.variable}`}>
//         {children}
//       </body>
//     </html>
//   );
// }


// app/layout.js
import React from "react";

// Root Layout Component
const Layout = ({ children }) => {
  return (
    // These tags must be directly in the layout
    <html lang="en">
      <body>
        <header>
          {/* <h1>My Application</h1> */}
        </header>
        <main>{children}</main>
        {/* <footer>Footer Content</footer> */}
      </body>
    </html>
  );
};

export default Layout;



