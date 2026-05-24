import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="md:ml-60 min-h-screen">
        <div className="mx-auto max-w-7xl p-6 pt-20 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
