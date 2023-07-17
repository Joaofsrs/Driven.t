import { prisma } from '@/config';

async function getHotelsList(){
    const hotels = await prisma.hotel.findMany();

    return hotels;
}

async function getHotelsRoomList(hotelId: number){
    const rooms = await prisma.hotel.findUnique({
        where:{
            id: hotelId
        },
        include: {
            Rooms: true
        }
    });

    return rooms;
}

const hotelsRepository = {
    getHotelsList,
    getHotelsRoomList
}

export default hotelsRepository;