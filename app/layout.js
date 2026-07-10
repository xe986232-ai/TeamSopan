import { Unbounded, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Kept ONLY for the "SOPAN TEAM" hero title — do not use elsewhere.
const hero = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-hero",
});

// Outfit is now the site-wide font (headings + body), with a wide weight
// range so we can vary bold/regular across sections instead of everything
// looking the same.
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "SOPAN TEAM",
  description:
    "SOPAN TEAM — komunitas kreator dengan tiga divisi: Remix, Creator, dan Leadis.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${hero.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased bg-base text-ink">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
