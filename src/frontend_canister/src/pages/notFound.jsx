import React from "react";
import Header from "../layouts/header";
import footer from "../layouts/footer";
import NotFoundCard from "../components/notFoundPage/notFoundCard";

function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream-100">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <NotFoundCard />
      </main>
      <footer />
    </div>
  );
}

export default NotFoundPage;
