import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getHotelsList(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId as number;
  try {
    const hotels = await hotelsService.getHotelsList(userId);
    console.log(hotels);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if(error.name === "PaymentRequired"){
      return res.status(httpStatus.PAYMENT_REQUIRED).send({});
    }
    if(error.name === "NotFoundError"){
      return res.status(httpStatus.NOT_FOUND).send({});
    }
    return res.status(httpStatus.BAD_REQUEST).send({});
  }
}

export async function getHotelsRoomList(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId as number;
  const hotelId = parseInt(req.params.hotelId) as number; 
  try {
    const hotels = await hotelsService.getHotelsRoomList(hotelId, userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if(error.name === "PaymentRequired"){
      return res.status(httpStatus.PAYMENT_REQUIRED).send({});
    }
    if(error.name === "NotFoundError"){
      return res.status(httpStatus.NOT_FOUND).send({});
    }
    return res.status(httpStatus.BAD_REQUEST).send({});
  }
}
