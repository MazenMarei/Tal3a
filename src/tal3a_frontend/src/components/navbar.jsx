import { useState, useEffect } from "react";
import Logo_1 from "../assets/Logo_1.svg";
import { Button } from "./button";
import { Menu, X, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { createActor } from "declarations/user_canister";
import { canisterId as importedCanisterId } from "declarations/user_canister/index.js";
import { AuthClient } from "@dfinity/auth-client";
import { toast } from "@lucide/lab";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

// Fallback canister ID in case environment variables aren't loaded
const canisterId = importedCanisterId;

const network = import.meta.env.VITE_DFX_NETWORK;
const identityProvider =
  network == "ic"
    ? "https://identity.ic0.app"
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"; // Local
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [state, setState] = useState({
    actor: undefined,
    authClient: undefined,
    isAuthenticated: false,
    principal: "",
    User: null,
  });
  // Initialize auth client
  useEffect(() => {
    updateActor();
  }, []);

  const updateActor = async () => {
    try {
      console.log("=== Environment Debug ===");
      console.log("Canister ID:", canisterId);
      console.log("Environment variables (import.meta.env):", import.meta.env);
      console.log("Specific env vars:", {
        VITE_CANISTER_ID_user_CANISTER: import.meta.env
          .VITE_CANISTER_ID_user_CANISTER,
        VITE_DFX_NETWORK: import.meta.env.VITE_DFX_NETWORK,
      });

      if (!canisterId) {
        console.error(
          "ERROR: canisterId is undefined! Check environment variable loading."
        );
        return;
      }

      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();

      const actor = createActor(canisterId, {
        identity,
      });
      const isAuthenticated = await authClient.isAuthenticated();

      setState((prev) => ({
        ...prev,
        actor,
        authClient,
        isAuthenticated,
      }));

      if (isAuthenticated) {
        await getUserData(actor, isAuthenticated);
      } else {
        // Clear any existing user data when not authenticated
        setState((prev) => ({
          ...prev,
          User: null,
        }));
      }
    } catch (error) {
      console.error("Error updating actor:", error);
    }
  };

  const login = async () => {
    await state.authClient.login({
      identityProvider,
      onSuccess: updateActor,
    });
  };

  const logout = async () => {
    await state.authClient.logout();
    updateActor();
  };

  const getUserData = async (
    actorToUse = null,
    isAuthenticatedToUse = null
  ) => {
    const actor = actorToUse || state.actor;
    const isAuthenticated =
      isAuthenticatedToUse !== null
        ? isAuthenticatedToUse
        : state.isAuthenticated;

    if (!actor) {
      console.error("Actor not initialized from getUserData");
      return;
    }

    if (!isAuthenticated) {
      console.warn("User is not authenticated, skipping getUserData");
      setState((prev) => ({
        ...prev,
        User: null,
      }));
      return;
    }

    try {
      const result = await actor.get_user_data();

      if (result.Ok) {
        toast.success("Logged in successfully!");
        const userData = result.Ok;
        setState((prev) => ({
          ...prev,
          User: userData,
        }));
      } else if (result.Err) {
        console.error("Error from backend:", result.Err);
      }
    } catch (error) {
      toast.error("An error occurred while logging in.");
      console.error("Error fetching user data:", error);
    }
  };
  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center">
                <img src={Logo_1} alt="Tal3a Logo" className="h-8" />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {location.pathname === "/" ? (
                <>
                  <a
                    href="#features"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#sports"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Sports
                  </a>
                  <a
                    href="/about-us"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    About
                  </a>
                </>
              ) : (
                ""
              )}
              {state.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={
                            state.User?.avatarUrl ||
                            "/placeholder.svg?height=32&width=32"
                          }
                        />
                        <AvatarFallback>
                          {state.User?.name?.[0] +
                            state.User?.name?.[state.User?.name?.length - 1]}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <a href="/coming-soon">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                    </a>
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:bg-red-300 focus:text-red-800"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" onClick={login}>
                  Sign In
                </Button>
              )}
              {/* <Button size="sm" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button> */}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {state.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={
                            state.User?.avatarUrl ||
                            "/placeholder.svg?height=32&width=32"
                          }
                        />
                        <AvatarFallback>
                          {state.User?.name?.[0] +
                            state.User?.name?.[state.User?.name?.length - 1]}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <a href="/coming-soon">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                    </a>
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:bg-red-300 focus:text-red-800"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                ""
              )}
              {location.pathname === "/" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-foreground"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && location.pathname === "/" && (
            <div className="md:hidden border-t bg-background">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#features"
                  className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Features
                </a>
                <a
                  href="#sports"
                  className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Sports
                </a>
                <a
                  href="#pricing"
                  className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="/about-us"
                  className="block px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  About
                </a>
                <div className="flex flex-col gap-2 px-3 pt-2">
                  {state.isAuthenticated ? (
                    ""
                  ) : (
                    <Button variant="outline" size="sm" onClick={login}>
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
