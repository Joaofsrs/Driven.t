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
        res.status(httpStatus.OK).send(result);
    } catch (err) {
        if (err.name === 'TicketUnexisting') {
            return res.status(httpStatus.NOT_FOUND).send({
            message: err.message,
            });
        }
        if (err.name === 'TicketDontBelongToThisUser') {
            return res.status(httpStatus.UNAUTHORIZED).send({
            message: err.message,
            });
        }
        
        res.sendStatus(httpStatus.BAD_REQUEST);
    }
}

export async function getPayments(req: AuthenticatedRequest, res: Response) {
    const { ticketId } = req.query as Record<string, string>;
    const userId = req.userId as number;
    try{
        const result: Payment = await paymentsService.getPayments(ticketId, userId);
        res.status(httpStatus.OK).send(result);
    } catch (err) {
        if (err.name === 'TicketUnexisting') {
            return res.status(httpStatus.NOT_FOUND).send({
            message: err.message,
            });
        }
        
        if (err.name === 'TicketDontBelongToThisUser') {
            return res.status(httpStatus.UNAUTHORIZED).send({
            message: err.message,
            });
        }
        
        if (err.name === 'TicketIdDontSend') {
            return res.status(httpStatus.BAD_REQUEST).send({
            message: err.message,
            });
        }
        res.sendStatus(httpStatus.BAD_REQUEST);
    }
}