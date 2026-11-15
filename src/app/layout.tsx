import { Lexend_Deca, Manrope, Onest } from "next/font/google";
import "./globals.css";

const lexend = Lexend_Deca({ subsets: ["latin"], weight: "600", variable: "--font-lexend" });
const manrope = Manrope({ subsets: ["latin"], weight: "700", variable: "--font-manrope" });
const onest = Onest({ subsets: ["latin"], weight: "400", variable: "--font-onest" });

export const metadata = {
  title: { default: "HemoVida | Doação de sangue", template: "%s | HemoVida" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${lexend.variable} ${manrope.variable} ${onest.variable}`}>
      <body>{children}</body>
    </html>
  );
}