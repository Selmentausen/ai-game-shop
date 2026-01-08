import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { QuicStream } from "node:quic";

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({error: "Unauthorized"}); return;}
    try {
        let cart = await prisma.cart.findUnique({
            where: { userId: userId },
            include: {
                items: {
                    include: { game: true },
                    orderBy: { id: 'asc' }
                }
            }
        });
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: { items: { include: { game: true } } }
            });
        }
        res.json(cart);
   } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart "});
   }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { gameId } = req.body;

    if (!userId || !gameId) {
        res.status(500).json({ error: "Invalid request" });
        return;
    }
    try {
        let cart = await prisma.cart.findUnique({
            where: {
                userId: userId
            }
        });
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId }
            });
        }

        const item = await prisma.cartItem.upsert({
            where: {
                cartId_gameId: {
                    cartId: cart.id,
                    gameId: gameId
                }
            },
            update: {
                quantity: { increment: 1 }
            },
            create: {
                cartId: cart.id,
                gameId: gameId,
                quantity: 1
            }
        });
        res.json(item)
    } catch (error) {
        res.status(500).json({ error: `Failed to add item to the cart: ${error}` });
        return;
    }
}

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const cartItemId = parseInt(req.params.id);

    try {
        const item = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true }
        });
        if (!item || item.cart.userId !== userId) {
            res.status(403).json({ error: "Not authorized to remove this item" });
            return;
        }
        await prisma.cartItem.delete({
            where: {id: cartItemId}
        });
        res.json({ message: "Item removed" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete item from the cart" })
    }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const cartItemId = parseInt(req.params.id);
    const { change } = req.body;

    try {
        const item = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true }
        });
        if (!item || item.cart.userId !== userId) {
            res.status(403).json({ error: "Not authorized" })
        }
        const newQuantity = item?.quantity + change;
        if (newQuantity <= 0) {
            await prisma.cartItem.delete({ where: { id: cartItemId } });
            res.json({ id:cartItemId, quantity: 0, deleted: true});
        } else {
            const updatedItem = await prisma.cartItem.update({
                where: { id: cartItemId },
                data: { quantity: newQuantity },
                include: { game: true }
            });
            res.json(updatedItem)
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update item" });
    }
};