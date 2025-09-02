import "./globals.css";
import Providers from "./providers";
import SiteHeader from "@/components/SiteHeader";

export const metadata = { title: "Rudraksha-Pasal" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}