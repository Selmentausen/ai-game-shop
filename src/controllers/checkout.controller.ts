import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { processPayment } from "../lib/payment.client.js";

export const checkout = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) { res.status(401).json({error: "Unauthorized"}); return; }
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {items: { include: { game:true } } }
        });
        if (!cart || cart.items.length <= 0) {
            res.status(400).json("Cart is empty");
            return;
        }

        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + (item.game.price * item.quantity);
        }, 0);
        console.log(`Processing checkout for User ${userId}: $${totalAmount}`);
        const paymentResult: any = await processPayment(userId, totalAmount);

        if(!paymentResult.success) {
            res.status(400).json({ error: "Payment failed" });
            return;
        }

        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });
        res.json({
            success: true,
            transactionId: paymentResult.transactionId,
            message: "Order placed successfully!"
        });
    } catch (error) {
        console.error("Checkout failed", error);
        res.status(500).json({ error: "Checkout failed" });
    }
};