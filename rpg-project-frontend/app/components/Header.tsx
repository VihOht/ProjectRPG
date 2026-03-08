import { useAuthProvider } from "../providers";
import { Link, useNavigate } from "react-router";


export function Header({ children }: { children?: React.ReactNode }) {
    const { username, isAuthenticated, logout } = useAuthProvider();
    const navigate = useNavigate();



    return (
        <header className="text-vaccineBlack p-4 shadow-md flex justify-between items-center">
            <Link to="/" className="text-2xl font-myFont hover:text-vaccineRed transition-colors">
                    Insonia
            </Link>
            <div className="flex items-center gap-2">
                {username && <span className="text-vaccineBlack font-myFont text-xl">{username} - </span>}
                {isAuthenticated ? (
                <button
                    onClick={() => logout()}
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-900 transition-colors"
                >
                    Logout
                </button>
                ) : (
                <button
                    onClick={() => navigate('/auth/login')}
                    className="px-4 py-2 bg-vaccineRed text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Login
                </button>
                )}
                <h1 className="text-xl">|</h1>
                {children ? children : null}
            </div>
        </header>
    )
}   
