import React, { useState } from "react";
import Header from "../components/ui/navBar";
import footer from "../layouts/footer";
import NavBar from "../components/eventsPage/navBar";
import SideBar from "../components/eventsPage/sideBar";
import MainBody from "../components/eventsPage/eventsCard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Events = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100  flex flex-col">
      <Header />
      <div className="mt-15">
        <NavBar />
      </div>
      <div className="flex-1 flex flex-row mt-3 px-3">
        <div className="hidden md:block flex-shrink-0">
          <SideBar />
        </div>
        <div className="md:hidden">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50">
              <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SideBar />
            </SheetContent>
          </Sheet>
        </div>
        <MainBody />
      </div>
      <footer />
    </div>
  );
};

export default Events;
