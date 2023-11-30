import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routes } from "../routes/routes.js";

dotenv.config();

export const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.use(routes)
