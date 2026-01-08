import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import gameRoutes from "./routes/game.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import agentRoutes from "./routes/agent.routes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/agent", agentRoutes);


app.listen(PORT, () => {
    console.log(`Game Shop API running on http://localhost:${PORT}`);
});
