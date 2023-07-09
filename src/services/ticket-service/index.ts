import { CompletTicket, TicketTypeId } from "@/protocols";
import ticketRepository from "@/repositories/ticket-repository";
import { Enrollment, Ticket, TicketType } from "@prisma/client";
import { ticketTypeUnexisting, userDontHaveEnrollment, userDontHaveTicket } from "./errors";
import enrollmentRepository from "@/repositories/enrollment-repository";

async function getTicketsTypes(){
    const result: TicketType[] = await ticketRepository.getTicketsTypes();

    return result;
}

async function getTicket(userId: number) {
    const enrollmentData: Enrollment = await enrollmentRepository.getEnrollmentByUserId(userId);
    if(!enrollmentData){
        throw userDontHaveEnrollment();
    }
    const ticket: Ticket[] = await ticketRepository.getTicketByUserId(userId);
    if(ticket.length === 0){
        throw userDontHaveTicket();
    }
    const result: CompletTicket = await ticketRepository.getTicket(userId);
    if(!result){
        throw userDontHaveTicket();
    }

    return result;
}

async function createNewTicket(ticketTypeId: TicketTypeId, userId: number){
    const enrollmentData: Enrollment = await enrollmentRepository.getEnrollmentByUserId(userId);
    if(!enrollmentData){
        throw userDontHaveEnrollment();
    }

    const ticketTypeExist = await ticketRepository.ticketTypeByTicketTypeId(ticketTypeId.ticketTypeId)
    if(!ticketTypeExist){
        throw ticketTypeUnexisting();
    }
    
    const result: CompletTicket = await ticketRepository.createNewTicket(ticketTypeId, userId);

    return result;
}

const ticketService = {
    getTicketsTypes,
    getTicket,
    createNewTicket
};

export default ticketService;