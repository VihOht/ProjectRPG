import { useAuthProvider } from "../providers";
import { Link, useNavigate } from "react-router";


export function Header({ children }: { children?: React.ReactNode }) {
    const { username, isAuthenticated, logout } = useAuthProvider();
    const navigate = useNavigate();



    return (
        <header className="p-4 text-black shadow-md border-b-1 border-vaccineGray-1000 font-trajanPRegular flex justify-between items-center">
            <Link to="/" className="text-2xl text-white font-trajanPRegular hover:text-vaccinePurple transition-colors">
                    Insonia
            </Link>
            <div className="flex items-center gap-2">
                
                {children ? children : null}
                <h1 className="text-xl text-white/30">|</h1>
                {username && <span className="text-white font-trajanPRegular text-lg">{username} -</span>}
                {isAuthenticated ? (
                <button
                    onClick={() => logout()}
                    className="py-2 text-lg text-white rounded-md hover:bg-gray-900 transition-colors"
                >
                    Logout
                </button>
                ) : (
                <button
                    onClick={() => navigate('/auth/login')}
                    className="py-2 text-lg text-white rounded-md hover:bg-gray-900 transition-colors"
                >
                    Login
                </button>
                )}
                
            </div>
        </header>
    )
}   
