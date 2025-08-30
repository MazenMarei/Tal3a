import NavBar from "@/components/loginPage/navBar";
import LoginCard from "@/components/loginPage/loginCard";
import Footer from "@/components/footer";
import { useCurrentUser, useIsAuthenticated } from "@/hooks/useAuth";
const Login = () => {
  const { data: isAuthenticated, isSuccess } = useIsAuthenticated();
  const { data: currentUser } = useCurrentUser();
  if (isSuccess) {
    if (currentUser) {
      if ("Ok" in currentUser) {
        console.log("User is exist:", currentUser);
      } else {
        if (currentUser.Err.code == 404) {
          console.log("User not found should redirect to login flow");
        } else {
          console.log("User error:", currentUser);
        }
      }
    }
  } else {
    return (
      <div className="min-h-screen">
        <NavBar />
        <LoginCard />
        <Footer />
      </div>
    );
  }

};

export default Login;
