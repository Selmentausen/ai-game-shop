import { Router } from "express";
import { getCart, addToCart, removeFromCart, updateCartItem } from "../controllers/cart.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { checkout } from "../controllers/checkout.controller.js";

const router = Router();

router.use(authenticateToken);
router.get("/", getCart);
router.post("/", addToCart);
router.delete("/:id", removeFromCart);
router.patch("/:id", updateCartItem);
router.post("/checkout", checkout)

export default router;