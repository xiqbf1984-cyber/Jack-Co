import { ClerkProvider } from '@clerk/nextjs';
import FilmGrainOverlay from '@/components/ui/film-grain-overlay';
import "./globals.css";

export const metadata = {
  title: "NeoHuman",
  description: "AI-powered hiring assessments. Find, evaluate, and hire remarkable talent.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="noise-texture">
          <FilmGrainOverlay />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
