import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
