import bookingRepository from "@/repositories/booking-repository";
import { fullRoom, invalidBooking, invalidBookingId, invalidRoomId, ruleRoom } from "./errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getBooking(userId: number) {
    const booking = await bookingRepository.fingBookingByUserId(userId);

    if(!booking){
        throw invalidBooking();
    }

    return {
        id: booking.id,
        Room: booking.Room
    };
}

async function testIfRoomPass(userId: number, roomId: number){
    
}

async function postBooking(userId: number, roomId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment){
        throw ruleRoom();
    }

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    if(!ticket){
        throw ruleRoom();
    }
    if(ticket.TicketType.isRemote || !ticket.TicketType.includesHotel){
        throw ruleRoom();
    }

    if(isNaN(roomId)){
        throw invalidRoomId();
    }
    const room = await bookingRepository.getFullRoomById(roomId);

    if(!room){
        throw invalidRoomId();
    }

    if(room.Booking.length !== 0){
        throw fullRoom();
    }
    const booking = await bookingRepository.createBooking(userId, roomId);

    return booking;
}

async function putBookingByRoomId(userId: number, roomId: number, bookingId: number) {
    if(isNaN(bookingId)){
        throw invalidBookingId();
    }
    const bookingExist = await bookingRepository.fingBookingByUserId(userId);
    if(!bookingExist){
        throw invalidBookingId();
    }
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if(!enrollment){
        throw ruleRoom();
    }

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    if(!ticket){
        throw ruleRoom();
    }
    if(ticket.TicketType.isRemote || !ticket.TicketType.includesHotel){
        throw ruleRoom();
    }

    if(isNaN(roomId)){
        throw invalidRoomId();
    }
    const room = await bookingRepository.getFullRoomById(roomId);

    if(!room){
        throw invalidRoomId();
    }

    if(room.Booking.length !== 0){
        throw fullRoom();
    }

    const booking = await bookingRepository.putBookingByRoomId(userId, roomId, bookingId);

    return booking;
}

const bookingService = {
    getBooking,
    putBookingByRoomId,
    postBooking
};

export default bookingService;