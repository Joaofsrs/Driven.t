import { CompletTicket, TicketTypeId } from "@/protocols";
import ticketRepository from "@/repositories/ticket-repository";
import { TicketType } from "@prisma/client";
import { ticketTypeUnexisting } from "./errors";

async function getTicketsTypes(){
    const result: TicketType[] = await ticketRepository.getTicketsTypes();

    return result;
}

async function getTicket(userId: number) {
    const result: CompletTicket = await ticketRepository.getTicket(userId);

    return result;
}

async function createNewTicket(ticketTypeId: TicketTypeId, userId: number){
    const ticketTypeExist = await ticketRepository.ticketTypeByTicketTypeId(ticketTypeId.ticketTypeId)
    if(!ticketTypeExist){
        console.log(ticketTypeExist)
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