import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getHotelsList(req: Request, res: Response) {
  try {
    const hotels = await hotelsService.getHotelsList();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getHotelsRoomList(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId) as number; 
  try {
    const hotels = await hotelsService.getHotelsRoomList(hotelId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
