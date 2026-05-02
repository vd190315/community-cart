import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ResidentCartProvider } from "@/app/resident/ResidentCartProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Community Cart",
  description: "Save Together, Shop Smarter."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ResidentCartProvider>
          <div className="min-h-screen">
            <AppHeader />
            <main className="mx-auto w-full max-w-md px-4 py-6">{children}</main>
          </div>
        </ResidentCartProvider>
      </body>
    </html>
  );
}
