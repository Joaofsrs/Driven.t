import { Hotel } from "@prisma/client";
import hotelsRepository from "@/repositories/hotels-repository";
import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { paymentRequired } from "./errors";
import paymentsRepository from "@/repositories/payments-repository";

async function validateHotels(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment) {
        console.log("enrollment")
        throw notFoundError();
    }
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if(!ticket) {
        console.log("ticket")
        throw notFoundError();
    }
    const hotels = await hotelsRepository.getHotelsList();
    if(hotels.length <= 0) {
        console.log("hotels")
        throw notFoundError();
    }
    if(ticket.TicketType.isRemote || ticket.TicketType.includesHotel){
        console.log("ticket remote hotel")
        throw paymentRequired();
    }
    const payment = await paymentsRepository.findPaymentByTicketId(ticket.id);
    if(!payment){
        console.log("payment")
        throw paymentRequired();
    }    
}

async function getHotelsList(userId: number): Promise<Hotel[]>{
    await validateHotels(userId);
    const hotels = await hotelsRepository.getHotelsList();
    
    return hotels;
}

async function getHotelsRoomList(hotelId: number, userId: number): Promise<Hotel>{
    await validateHotels(userId);
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