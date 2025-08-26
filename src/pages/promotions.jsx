import React, { useState } from "react";
import Header from "../components/ui/navBar";
import Footer from "../layouts/Footer";
import NavBar from "../components/promotionsPage/navBar";
import SideBar from "../components/promotionsPage/sideBar";
import MainBody from "../components/promotionsPage/promotionsCard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Promotions = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />
      <div className="mt-15 mb-4">
        <NavBar />
      </div>
      <div className="flex-1 flex flex-row mt-3 px-3 pb-50">
        <div className="hidden md:block flex-shrink-0">
          <SideBar />
        </div>
        <div className="flex-1 mx-3 pt-10">
          <MainBody />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SideBar />
          </SheetContent>
        </Sheet>
      </div>
      <Footer />
    </div>
  );
};

export default Promotions;
