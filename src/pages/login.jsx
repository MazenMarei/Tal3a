import NavBar from '../components/loginPage/navBar'
import Body from '../components/loginPage/loginCard'
import Footer from '@/layouts/footer'
const Login = () => {
    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <NavBar />
            <Body />
            <Footer/>
        </div>
    )
}
export default Login;