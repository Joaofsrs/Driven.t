import { AuthenticatedRequest } from "@/middlewares";
import { CompletTicket, TicketTypeId } from "@/protocols";
import ticketService from "@/services/ticket-service";
import { TicketType } from "@prisma/client";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
    try{
        const result: TicketType[] = await ticketService.getTicketsTypes();
        res.send(result).status(httpStatus.OK)
    } catch (err) { 
        res.sendStatus(httpStatus.UNAUTHORIZED)
    }
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
    const userId: number = req.userId as number;
    try{
        const result: CompletTicket = await ticketService.getTicket(userId);
        res.send(result).status(httpStatus.OK);
    } catch (err) { 
        res.sendStatus(httpStatus.UNAUTHORIZED)
    }
}

export async function createNewTicket(req: AuthenticatedRequest, res: Response){
    const ticketTypeId = req.body as TicketTypeId;
    const userId: number = req.userId as number;
    try{
        const result: CompletTicket = await ticketService.createNewTicket(ticketTypeId, userId);
        res.send(result).status(httpStatus.CREATED);
    } catch (err) { 
        res.sendStatus(httpStatus.UNAUTHORIZED)
    }
} 