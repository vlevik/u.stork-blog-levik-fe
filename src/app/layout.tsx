import NavBar from "@/components/NavBar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth h-100">
      <body>
				<NavBar/>
				{children}
			</body>
    </html>
  );
}
