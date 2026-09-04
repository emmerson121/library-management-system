import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meridian University Library",
  description: "A Library Management System that aids learning",

  icons: {
    icon: "/library-icon.png",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
