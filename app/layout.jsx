import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./utils/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Todo App",
  description: "A Next JS / AppWrite / TanStack Query Todo App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
