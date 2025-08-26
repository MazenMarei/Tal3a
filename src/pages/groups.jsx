import React, { useState } from 'react';
import Header from '../components/profilePage/navBar';
import Footer from '../layouts/footer';
import NavBar from '../components/groupsPage/navBar';
import SideBar from '../components/groupsPage/sideBar';
import MainBody from '../components/groupsPage/mainBody';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const Groups = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
            <Header />
            <div className='mt-15'>
            <NavBar />
            </div>
            <div className="flex-1 flex flex-row mt-10 px-3">
                <div className="hidden md:block flex-shrink-0">
                    <SideBar />
                </div>
                <div className="md:hidden">
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                            <button className="fixed top-85 left-0 z-50 p-2 rounded-full bg-white shadow-md">
                                <Menu className="h-6 w-6 text-slate-700" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <SideBar />
                        </SheetContent>
                    </Sheet>
                </div>
                <MainBody />
            </div>
            <Footer />
        </div>
    );
};

export default Groups;