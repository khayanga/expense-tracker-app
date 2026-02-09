import express from 'express';
import mpesaRoutes from './modules/mpesa/mpesa.route.js';
import walletRoutes from './modules/wallet/wallet.route.js';
import farmProfileRoutes from './modules/farm-profile/farmProfile.routes.js';
import productionCycleRoutes from './modules/production-cycle/productionCycle.routes.js';
import productionStageRoutes from './modules/production-stage/productionStage.routes.js';
import dotenv from 'dotenv';
import rateLimiter from '../middleware/rateLimiter.js';

dotenv.config();

 
const app = express();
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/wallet", walletRoutes);
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/farm-profile", farmProfileRoutes);
app.use ("/api/production-cycle", productionCycleRoutes);
app.use("/api/production-stage", productionStageRoutes);


app.get("/", (res)=>{
  res.send("Welcome to Wallet API")
})


app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});