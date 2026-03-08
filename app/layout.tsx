import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const singingSans = localFont({
  src: '../public/Singing_Sans.ttf',
})

export const metadata: Metadata = {
  title: "ESC Rank",
  description: "Eurovision Song Contest ranking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${singingSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
