import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { items } = useCart();

    return (
        <nav className="bg-white shadow-sm mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                    <span>🎮</span> AI Game Shop
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="text-gray-600">Hello, <b>{user.name}</b></span>
                            <button onClick={logout} className="text-sm text-red-600 hover:text-red-800">
                                Logout
                            </button>

                            {/* CART BUTTON */}
                            <Link to="/cart" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 transition-transform active:scale-95">
                                <span>🛒</span>
                                <span className="font-bold">{items.length}</span>
                            </Link>

                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}