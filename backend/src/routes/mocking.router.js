import { Router } from "express";
import { getProducts } from "../controllers/mock.controller.js";

const router = Router();

router.get("/products", getProducts);

export default router;