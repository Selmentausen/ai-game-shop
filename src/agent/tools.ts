import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { GameCategory } from "@prisma/client";

const searchSchema = z.object({
    query: z.string().optional().describe("Keywords to search for title or description"),
    category: z.enum(GameCategory).optional().describe("The specific genre/category of the game"),
    maxPrice: z.number().optional().describe("The maximum price the user is willing to pay")
});

export const inventoryTool = tool(
    async ({ query, category, maxPrice }) => {
        console.log(`AI Tool Call: Search "${query || ''}" | Cat: ${category || 'Any'} | Max: $${maxPrice || 'Any'}`);

        try {
            const whereClause: any = {};
            if (query) {
                whereClause.OR = [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } }
                ];
            }
            if (category) {
                whereClause.category = { equals: category};
            }
            if (maxPrice) {
                whereClause.price = { lte: maxPrice };
            }
            const games = await prisma.game.findMany({
                where: whereClause,
                select: {
                    id: true,
                    title: true,
                    price: true,
                    category: true,
                    description: true,
                    tags: true,
                    reviews: {
                        select: { rating: true }
                    }
                },
                take: 5
            });
            if (games.length === 0) {
                return "No games found matching those criteria. Suggest the user looks for something else.";
            }
            return JSON.stringify(games, null, 2);
        } catch (error) {
            console.error("Tool Error:", error);
            return "An error occured while searching the database.";
        }
    },
    {
        name: "search_inventory",
        description: "Search for the games in the shop inventory. Use this when the user asks for recommendations.",
        schema: searchSchema,
    }
);

export const tools = [inventoryTool];