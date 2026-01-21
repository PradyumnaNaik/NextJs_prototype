import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Commerce Learning App | RSC, Server Actions & UI Diffs",
  description: "Learn Next.js with React Server Components, Server Actions, and interactive UI patterns",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-indigo-600">
                    🛍️ EduShop
                  </h1>
                  <p className="ml-4 text-sm text-gray-600">
                    Learning Next.js with RSC & Server Actions
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  Demonstration App
                </div>
              </div>
            </nav>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-gray-900 text-white mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <p className="text-sm text-gray-400">
                This app demonstrates React Server Components (RSC), Server Actions, and UI patterns in Next.js 15+
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
