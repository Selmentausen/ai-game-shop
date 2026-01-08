import { Router } from "express"
import { getAllGames, getGameById } from "../controllers/game.controller.js"

const router = Router();

router.get("/", getAllGames);
router.get("/:id", getGameById);

export default router;