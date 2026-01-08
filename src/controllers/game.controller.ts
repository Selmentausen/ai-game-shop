import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const getAllGames = async(req: Request, res: Response) => {
    try {
        const games = await prisma.game.findMany({
            select: {
                id: true, title: true, price: true, description: true,
                coverImage: true, category: true, tags: true,
                reviews: { select: { rating: true} }
            }
        });
        res.json(games)
    } catch (error) {
        res.json(500).json({ error: "Failed to fetch games" });
    }
};

export const getGameById = async(req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) { 
        res.status(400).json({ error: "Invalid ID" }); 
        return; 
    }
    try {
        const game = await prisma.game.findUnique({ where: { id }, include: { reviews: true }});
        if (!game) {
            res.status(404).json({ error: "Not found" });
            return;
        }
        res.json(game);
    } catch (error) {
        res.json(500).json({ error: "Failed to fetch game" });
    }
};