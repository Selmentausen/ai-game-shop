import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { type CartItem } from "./types";
import { apiFetch } from "./lib/api";

interface CartContextType {
    items: CartItem[];
    addToCart: (gameId: number) => Promise<void>;
    removeFromCart: (cartItemId: number) => Promise<void>;
    changeQuantity: (CartItemId: number, change: number) => Promise<void>;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { token, isAuthenticated } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);

    const fetchCart = async () => {
        if (!token) {
            setItems([]);
            return;
        }

        try {
            const res = await apiFetch("/cart");
            if (res.ok) {
                const data = await res.json();
                console.log("Cart Data from API:", data);
                setItems(data.items || []);
            } else {
                console.error("Failed to fetch cart:", res.status);
            }
        } catch (error) {
            console.error("Network error fetching cart", error);
        }
    };
    useEffect(() => {
        fetchCart();
    }, [token]);

    const addToCart = async (gameId: number) => {
        if (!isAuthenticated) {
            alert("Please login to shop!");
            return
        }
        try {
            const res = await apiFetch("/cart", {
                method: "POST",
                body: JSON.stringify({ gameId })
            });

            if (res.ok) {
                await fetchCart();
            } else {
                alert(`Failed to add to cart`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCart = async (cartItemId: number) => {
        try {
            const res = await apiFetch(`/cart/${cartItemId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setItems(prev => prev.filter(item => item.id !== cartItemId));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const changeQuantity = async (cartItemId: number, change: number) => {
        try {
            const res = await apiFetch(`/cart/${cartItemId}`, {
                method: "PATCH",
                body: JSON.stringify({ change })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.deleted) {
                    setItems(prev => prev.filter(item => item.id !== cartItemId));
                } else {
                    setItems(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: data.quantity } : item));
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    const totalPrice = items.reduce((sum, item) => sum + (item.game.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, changeQuantity, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("userCart must be used within a CartProvider");
    return context;
}
