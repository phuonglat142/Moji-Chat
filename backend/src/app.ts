import express from 'express';
import 'dotenv/config' 
import { connectDB } from 'libs/db';

const app = express();
const PORT = process.env.PORT || 8080

//middleware 
app.use(express.json());

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
});

