import express from 'express';
import transactionRoute from './routes/transactionRoute.js';
import dotenv from 'dotenv';

dotenv.config();

 
const app = express();

app.use(express.json());

const PORT = process.env.PORT

app.use("/api/transactions", transactionRoute);

app.get("/", (res)=>{
  res.send("Welcome to Wallet API")
})

app.listen(PORT, () => {
  console.log("🚀 Server running " );
});