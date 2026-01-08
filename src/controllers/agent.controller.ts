import { Request, Response } from "express";
import { agentExecutor } from "../agent/graph.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { findPackageJSON } from "node:module";
import { loadProtosWithOptions } from "@grpc/proto-loader/build/src/util.js";

export const chatWithAgent = async (req: Request, res: Response): Promise<void> => {
    const { message } = req.body;
    if (!message) {
        res.status(400).json({ error: "Message is required" });
        return;
    }
    try {
        const SYSTEM_PROMPT = `
            You are a helpful sales assistant for a Video Game Shop.
            You have access to the store's inventory database.
            
            RULES:
            1. If the user asks for game recommendations, ALWAYS use the 'search_inventory' tool.
            2. Do not guess prices. Check the database.
            3. Be concise and friendly.
            4. If you find games, mention their price and rating.
        `;
        const inputs = {
            messages: [
                new SystemMessage(SYSTEM_PROMPT),
                new HumanMessage(message)
            ]
        };
        console.log(`Agent thinking about "${message}"`);
        const finalState = await agentExecutor.invoke(inputs);
        const lastMessage = finalState.messages[finalState.messages.length - 1];
        res.json({ reply: lastMessage.content })
    } catch (error) {
        console.error("Agent Error:", error)
        res.status(500).json({ error: "Failed to process request" });
    }
};