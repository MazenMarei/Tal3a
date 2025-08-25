import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import NotFound from "./pages/NotFount";
import ComingSoon from "./pages/ComingSoon";
import "./styles/globals.css";
import { AboutUsPage } from "./pages/AboutUs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="*" element={<NotFound />} />
        <Route path="coming-soon" element={<ComingSoon />} />
        <Route path="about-us" element={<AboutUsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
