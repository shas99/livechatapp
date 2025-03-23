"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "react-oidc-context";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_authority,
  client_id: process.env.NEXT_PUBLIC_clientId,
  redirect_uri: process.env.NEXT_PUBLIC_redirect_uri,
  response_type: process.env.NEXT_PUBLIC_response_type,
  scope: process.env.NEXT_PUBLIC_scope,
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
                <AuthProvider {...cognitoAuthConfig}>{children}</AuthProvider>
      </body>
    </html>
  );
}
