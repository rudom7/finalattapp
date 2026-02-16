import { Link, useRoute } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/theme-toggle";
import logoImage from "@/lib/logos/zeipf_logo.png";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [isQueriesActive] = useRoute("/queries");
  const [isClaimsActive] = useRoute("/claims");
  const [isRegulationsActive] = useRoute("/regulations");
  const [isOverviewActive] = useRoute("/overview");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItemClass = (isActive: boolean) =>
    `block px-4 py-2 text-sm font-medium transition rounded-lg ${
      isActive
        ? "bg-[#EAB308]/20 text-[#2D2F72] border-l-4 border-[#EAB308]"
        : "text-white hover:text-yellow-200 hover:bg-[#2D2F72]/50"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#2D2F72]/80 backdrop-blur-md shadow-md"
          : "bg-[#2D2F72]"
      } dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 animate-fade-in`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 transition-all duration-500 ease-in-out">
          {/* Left Section: Logo + System Name */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <a className="flex items-center group">
                <img
                  src={logoImage}
                  alt="ZEIPF Logo"
                  className="h-10 w-auto transition-transform duration-500 group-hover:scale-110"
                />
                <div className="ml-4 leading-tight">
                  <div className="text-lg font-semibold text-yellow-300 font-poppins animate-pulse">
                    ZEIPF
                  </div>
                  <div className="text-sm text-white font-medium tracking-wide font-poppins">
                    Workflow System
                  </div>
                </div>
              </a>
            </Link>
          </div>

          {/* Middle Section: Nav Links */}
          <div className="hidden sm:flex items-center space-x-6 font-poppins text-sm font-medium">
            <Link href="/queries">
              <a className={navItemClass(isQueriesActive)}>Queries</a>
            </Link>
            <Link href="/claims">
              <a className={navItemClass(isClaimsActive)}>Claims</a>
            </Link>
            <Link href="/regulations">
              <a className={navItemClass(isRegulationsActive)}>
                Pensioner Management
              </a>
            </Link>
            {user?.role === "superadmin" && (
              <Link href="/overview">
                <a className={navItemClass(isOverviewActive)}>
                  Administrator Overview
                </a>
              </Link>
            )}
          </div>

          {/* Right Section: User Info */}
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-sm text-white dark:text-gray-200 font-poppins">
              {user?.username} ({user?.role})
            </span>
            <ThemeToggle />
            <Button
              variant="ghost"
              className="text-white border border-yellow-300 hover:bg-yellow-300 hover:text-[#2D2F72] transition"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>

          {/* Mobile Toggle */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-yellow-300"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-2 border-t border-gray-300 pt-4 space-y-3 animate-slide-down">
            <Link href="/queries">
              <a className={navItemClass(isQueriesActive)}>Queries</a>
            </Link>
            <Link href="/claims">
              <a className={navItemClass(isClaimsActive)}>Claims</a>
            </Link>
            <Link href="/regulations">
              <a className={navItemClass(isRegulationsActive)}>
                Pensioner Management
              </a>
            </Link>
            {user?.role === "superadmin" && (
              <Link href="/overview">
                <a className={navItemClass(isOverviewActive)}>
                  Administrator Overview
                </a>
              </Link>
            )}
            <div className="border-t border-gray-400 pt-3">
              <div className="text-sm text-white mb-2 font-poppins">
                {user?.username} ({user?.role})
              </div>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  className="w-full text-white border border-yellow-300 hover:bg-yellow-300 hover:text-[#2D2F72]"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
