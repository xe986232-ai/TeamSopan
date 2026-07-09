import { Unbounded, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const display = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-display",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
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
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased bg-base text-ink">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
