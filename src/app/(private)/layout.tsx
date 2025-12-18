import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import Header from "./Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="inter.className">
        <SidebarProvider>
          <div className="flex h-screen w-full bg-blue-50">
            <AppSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center bg-white border-b px-4">
                <Header />
              </div>

              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-blue-50">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
