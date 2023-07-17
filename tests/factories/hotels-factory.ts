import dayjs from 'dayjs';
import faker from '@faker-js/faker';
import { Booking, Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

export function createHotel(params: Partial<Hotel> = {}): Promise<Hotel> {
    return prisma.hotel.create({
        data: {
            name: params.name || faker.company.companyName(),
            image: params.image || faker.image.imageUrl()
        },
    });
}

export function createRoom(params: Partial<Room> = {}): Promise<Room> {
    return prisma.room.create({
        data: {
            name: faker.internet.domainWord(),
            capacity: parseInt(faker.random.numeric()),
            hotelId: params.hotelId
        },
    });
}

export function createBooking(params: Partial<Booking> = {}): Promise<Booking> {
    return prisma.booking.create({
        data: {
            userId: params.userId,
            roomId: params.roomId,
        },
    });
}
