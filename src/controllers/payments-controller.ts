import httpStatus from "http-status";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import { PaymentsProcess } from "@/protocols";
import paymentsService from "@/services/payments-service";
import { Payment } from "@prisma/client";

export async function paymentsProcess(req: AuthenticatedRequest, res: Response){
    const userId = req.userId as number;
    const body = req.body as PaymentsProcess;
    try{
        const result = await paymentsService.createPaymentsProcess(body, userId);
        res.send(result).status(httpStatus.OK);
    } catch (err) {
        res.sendStatus(httpStatus.BAD_REQUEST);
    }
}

export async function getPayments(req: AuthenticatedRequest, res: Response) {
    const { ticketId } = req.query as Record<string, string>;
    const userId = req.userId as number;
    try{
        const result: Payment = await paymentsService.getPayments(ticketId, userId);
        res.send(result).status(httpStatus.OK);
    } catch (err) {
        res.sendStatus(httpStatus.BAD_REQUEST);
    }
}