import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "../components/loginPage/navBar";
import Footer from "../layouts/Footer";
import Step1Location from "../components/loginFlowPage/locationStep";
import Step2Sports from "../components/loginFlowPage/sportStep";
import Step3PersonalInfo from "../components/loginFlowPage/personalInfoStep";
import Step4SocialPassword from "../components/loginFlowPage/passwordStep";

const LoginFlow = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 flex items-center justify-center p-4 mt-20">
        <Routes>
          <Route path="/" element={<Navigate to="location" replace />} />
          <Route path="location" element={<Step1Location />} />
          <Route path="sports" element={<Step2Sports />} />
          <Route path="personal-info" element={<Step3PersonalInfo />} />
          <Route path="social-password" element={<Step4SocialPassword />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
export default LoginFlow;
