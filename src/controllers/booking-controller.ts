import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import { InputBookingBody } from "@/protocols";
import bookingService from "@/services/booking-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId as number;
    try{
        const response = await bookingService.getBooking(userId);
        return res.status(200).send(response);
    } catch (error) {
        if(error.name === 'InvalidBooking'){
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { roomId } = req.body as InputBookingBody;
    const userId = req.userId as number;
    try{    
        const response = await bookingService.postBooking(userId, roomId);
        return res.status(200).send(response.id);
    } catch (error) {
        if(error.name === 'InvalidRoomId'){
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if(error.name === 'FullRoom' || error.name === 'RuleRoom'){
            return res.sendStatus(httpStatus.FORBIDDEN);
        }
        return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
}

export async function putBookingByRoomId(req: AuthenticatedRequest, res: Response) {
    const bookingId: number = Number(req.params.bookingId)
    const { roomId } = req.body as InputBookingBody;
    const userId = req.userId as number;
    try{
        const response = await bookingService.putBookingByRoomId(userId, roomId, bookingId);
        return res.status(200).send(response.id);
    } catch (error) {
        if(error.name === 'InvalidRoomId'){
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if(error.name === 'FullRoom' || error.name === 'RuleRoom' || error.name === 'InvalidBookingId'){
            return res.sendStatus(httpStatus.FORBIDDEN);
        }
        return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
}