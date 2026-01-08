import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { apiFetch } from "./lib/api";

export default function Cart() {
    const { items, removeFromCart, changeQuantity, totalPrice } = useCart();

    const handleCheckout = async () => {
        const confirmed = confirm(`Pay $${totalPrice.toFixed(2)}?`);
        if (!confirmed) return;

        try {
            const res = await apiFetch("/cart/checkout", { method: "POST" });
            if (res.ok) {
                alert("Payment Successful! Order placed.");
                window.location.href = "/";
            } else {
                alert("Payment Failed.");
            }
        } catch (error) {
            console.error(error);
            alert("System Error");
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8">Looks like you haven't found a game you like yet.</p>
                <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    Browse Games
                </Link>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {items.map((item) => (
                        <div key={item.id} className="p-6 border-b border-gray-100 flex items-center gap-6">

                            {/* Image */}
                            <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                                <img src={item.game.coverImage} className="w-full h-full object-cover" />
                            </div>

                            {/* Info */}
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900">{item.game.title}</h3>
                                <p className="text-gray-500 text-sm mb-2">{item.game.category}</p>
                                <div className="font-bold text-blue-600">${item.game.price}</div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center border border-gray-300 rounded overflow-hidden">

                                    {/* DECREASE BUTTON */}
                                    <button
                                        onClick={() => changeQuantity(item.id, -1)}
                                        className="w-8 h-8 bg-gray-50 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                                    >
                                        -
                                    </button>

                                    {/* QUANTITY NUMBER */}
                                    <div className="w-10 h-8 flex items-center justify-center text-sm font-bold border-l border-r border-gray-300">
                                        {item.quantity}
                                    </div>

                                    {/* INCREASE BUTTON */}
                                    <button
                                        onClick={() => changeQuantity(item.id, 1)}
                                        className="w-8 h-8 bg-gray-50 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-xs text-red-500 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Footer / Checkout */}
                    <div className="p-8 bg-gray-50 flex justify-between items-center">
                        <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">
                            ← Continue Shopping
                        </Link>

                        <div className="text-right">
                            <div className="text-gray-500 mb-1">Total Amount</div>
                            <div className="text-3xl font-bold text-gray-900 mb-4">
                                ${totalPrice.toFixed(2)}
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg active:scale-95 transition-transform"
                            >
                                Checkout Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}