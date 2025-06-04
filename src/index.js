import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectToDatabase from "./utils/connectToDatabase.js";

import authRouter from "./routers/auth.route.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

//Router
app.use('/api/auth', authRouter)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Server Running at: ", PORT);
    connectToDatabase();
})