import express from 'express';
import { sql } from './config/db.js';
 
const app = express();

const PORT = process.env.PORT 

// Initialize db

async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log("Table created successfully")
        
    } catch (error) {
        console.error("Error creating table", error);
        process.exit(1);
        
    }
    
}

app.get("/", (req, res)=>{
    res.send("Hello World");
})

initDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})