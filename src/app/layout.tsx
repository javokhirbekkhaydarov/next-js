import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import React from "react";

export const metadata: Metadata = {
  title: "Gurungxona",
  description:
    "With this site, you can meet with your friends without any VPN or tools. Just share a link and start the conversation.",
  keywords: [
    "video call",
    "online meeting",
    "free video chat",
    "webrtc",
    "peer-to-peer video",
    "no download video call",
  ],
  verification: {
    google: 'google-site-verification=ZEpQ6N1M4zxiE809-YBAaDmKPrPWyCov4XMCweyjsMI'
  },
  openGraph: {
    title: "Gurungxona",
    description:
      "With this site, you can meet with your friends without any VPN or tools. Just share a link and start the conversation.",
    images: [
      {
        url: "https://utfs.io/f/UVT8GTq2evXVZ47YKofz5Fsjvb6gkUqywaN3IQLcrThoPOVe",
        alt: "A preview of the video call platform",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
