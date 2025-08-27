import NavBar from "../components/loginPage/navBar";
import LoginCard from "../components/loginPage/loginCard";
import footer from "../layouts/footer";

const Login = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <LoginCard />
      <footer />
    </div>
  );
};

export default Login;
