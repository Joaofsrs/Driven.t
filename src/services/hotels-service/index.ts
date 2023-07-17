import { Hotel } from "@prisma/client";
import hotelsRepository from "@/repositories/hotels-repository";
import { notFoundError } from "@/errors";

async function getHotelsList(): Promise<Hotel[]>{
    const hotels = await hotelsRepository.getHotelsList();
    
    return hotels;
}

async function getHotelsRoomList(hotelId: number): Promise<Hotel>{
    if(Number.isNaN(hotelId)){
        throw notFoundError()
    }
    const rooms = await hotelsRepository.getHotelsRoomList(hotelId);
    
    return rooms;
}

const hotelsService = {
    getHotelsList,
    getHotelsRoomList
}

export default hotelsService;