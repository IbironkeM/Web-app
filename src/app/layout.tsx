import "./globals.css";
export const metadata = {
  title: "Country Explorer",
  description: "Search, explore, and compare countries",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
