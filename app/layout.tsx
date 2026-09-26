import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'ClauseCompass — Navigate the fine print', description: 'Understand your document, trace consequences, and prepare your next questions.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
