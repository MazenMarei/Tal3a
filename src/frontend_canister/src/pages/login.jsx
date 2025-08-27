import NavBar from "../components/loginPage/navBar";
import LoginCard from "../components/loginPage/loginCard";
import Footer from "../layouts/footer";

const Login = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <LoginCard />
      <Footer />
    </div>
  );
};

export default Login;
