import express from 'express';
import transactionRoute from './routes/transactionRoute.js';
import dotenv from 'dotenv';
import rateLimiter from '../middleware/rateLimiter.js';

dotenv.config();

 
const app = express();
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/transactions", transactionRoute);


app.get("/", (res)=>{
  res.send("Welcome to Wallet API")
})


app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});