import { prisma } from '@/config';

async function fingBookingByUserId(userId: number) {
    return await prisma.booking.findFirst({
      where: {
        userId: userId,
      },
      include: {
        Room: true,
      },
    });
}

async function fingBookingById(bookingId: number) {
    return await prisma.booking.findFirst({
      where: {
        id: bookingId,
      },
      include: {
        Room: true,
      },
    });
}

async function getFullRoomById(roomId: number) {
    return await prisma.room.findFirst({
        where: {
          id: roomId,
        },
        include: {
          Booking: true,
        },
      });
}

async function createBooking(userId: number, roomId: number) {
    const booking = await prisma.booking.create({
        data: {
            userId,
            roomId
        }
    })
    return booking;
}

async function putBookingByRoomId(userId: number, roomId: number, bookingId: number) {
    const booking = await prisma.booking.update({
        where:{
            id: bookingId
        },
        data:{
            userId,
            roomId
        }
    })

    return booking;
}

const bookingRepository = {
    fingBookingByUserId,
    fingBookingById,
    getFullRoomById,
    createBooking,
    putBookingByRoomId    
};

export default bookingRepository;