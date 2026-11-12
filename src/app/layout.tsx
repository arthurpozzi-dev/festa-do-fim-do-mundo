import type { Metadata, Viewport } from "next";
import { acid, gothicPixels, helvetica, kremlin, oldLondon, sloop } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Festa do Fim do Mundo",
  description: "Festa dedicada à formatura da Faculdade do PZ. BABT Organization.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${helvetica.variable} ${kremlin.variable} ${sloop.variable} ${gothicPixels.variable} ${acid.variable} ${oldLondon.variable} antialiased`}
    >
      <body className="min-h-svh bg-black font-helvetica text-white">
        {children}
      </body>
    </html>
  );
}
