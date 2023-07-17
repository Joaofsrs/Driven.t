import { getHotelsList, getHotelsRoomList } from '@/controllers';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

const hotelsRouter = Router();

hotelsRouter
    .all('/*', authenticateToken)
    .get('/', getHotelsList)
    .get('/:hotelId', getHotelsRoomList);

export { hotelsRouter };
