import { prisma } from '@/config';
import { createUser } from './users-factory';
import dayjs from 'dayjs';
import { createHotel, createRoomWithHotelId } from './hotels-factory';

export async function createBooking(userId?: number, roomId?: number) {
    const user = userId || (await createUser()).id;
    const hotel = roomId || (await createHotel()).id; 
    const room = roomId || (await createRoomWithHotelId(hotel)).id
    return prisma.booking.create({
        data: {
          userId: user,
          roomId: room,
          updatedAt: dayjs().toDate()
        },
    });
}