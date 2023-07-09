import { getPayments, paymentsProcess } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { paymentsSchema } from "@/schemas";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter
    .all('/*', authenticateToken)
    .post('/process', validateBody(paymentsSchema),paymentsProcess)
    .get('/', getPayments)

export{ paymentsRouter };