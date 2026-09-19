import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cthulhu's Inbox // The Eldritch Bureaucracy Simulator",
  description: "Manage incoming cosmic petitions from the depths of R'lyeh. Sanction dooms, smite mortal fools, and retain whatever scraps of sanity remain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-phosphor-base antialiased selection:bg-phosphor-base selection:text-black">
        {children}
      </body>
    </html>
  );
}
