import { createNewTicket, getTicket, getTicketsTypes } from "@/controllers/tickets-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { createTicketsSchema } from "@/schemas/ticket-schemas";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
    .get('/types', getTicketsTypes)
    .all('/*', authenticateToken)
    .post('/', validateBody(createTicketsSchema), createNewTicket)
    .get('/', getTicket)


export{ ticketsRouter };