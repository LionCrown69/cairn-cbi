import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  metadataBase: new URL('https://cairn-cbi.vercel.app'),
  title: 'CAIRN — Offline-First Alpine Mesh Communication (Team CBI)',
  description:
    'A synthetic-scenario platform for team communication, store-and-forward messaging, visible network topology, and AI situational awareness in mountain terrain with zero cellular connectivity. Built by Team CBI.',
  keywords: [
    'mesh networking',
    'offline communication',
    'alpine safety',
    'store and forward',
    'topographic line of sight',
    'delay tolerant networking',
    'Team CBI',
    'Gemini 2.5 Flash',
  ],
  authors: [{ name: 'Team CBI' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-deep-ground text-ink min-h-screen flex flex-col antialiased selection:bg-signal selection:text-deep-ground">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-line bg-deep-ground py-8 px-4 sm:px-8 text-xs font-mono text-mute">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-signal" />
              <span className="font-bold text-ink">CAIRN MESH CONCEPT</span>
              <span>·</span>
              <span>SYNTHETIC ALPINE SCENARIO ONLY</span>
            </div>
            <div className="text-[11px] text-mute/80">
              No real operational or weapons capability claimed. Scope restricted to safety, communication, and coordination.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
