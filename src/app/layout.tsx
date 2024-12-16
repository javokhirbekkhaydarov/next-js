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

export const metadata: Metadata = {
  title: "Instant Video Calls Without Downloads",
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
  openGraph: {
    title: "Gaplashmoq",
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
        {children}
      </body>
    </html>
  );
}
