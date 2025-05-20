// src/app/layout.js
'use client';

import { usePathname } from 'next/navigation';
import NavBar from './navigation-bar';
import './globals.css';

// Font setup
const manjariFont = {
  fontFamily: 'Manjari, sans-serif',
  fontWeight: 'normal',
  fontStyle: 'normal'
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Determine active page from pathname
  let activePage = '/';
  if (pathname.includes('/diaryEntries')) activePage = 'diary';
  if (pathname.includes('/community')) activePage = 'community';
  if (pathname.includes('/diaryRecording')) activePage = 'recording';

  return (
    <html lang="en">
      <head>
        {/* Import Manjari font from Google Fonts */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Manjari:wght@100;400;700&display=swap" 
        />
      </head>
      <body style={manjariFont} className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}