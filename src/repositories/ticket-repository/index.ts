import { prisma } from '@/config';
import { CompletTicket, TicketTypeId } from '@/protocols';
import { Enrollment, TicketType, Ticket } from '@prisma/client';

async function getTicketsTypes(){
    const result: TicketType[]= await prisma.ticketType.findMany();

    return result;
}

async function getEnrollmentByUserId(userId: number) {
    const enrollmentData: Enrollment = await prisma.enrollment.findUnique({
        where: {
            userId: userId
        }
    })
    return enrollmentData;
}

async function ticketTypeByTicketTypeId(ticketTypeId: number) {
    const ticketType: TicketType = await prisma.ticketType.findUnique({
        where: {
            id: ticketTypeId
        }
    })
    return ticketType;
}

async function ticketByEnrollmentId(enrollmentId: number) {
    const ticket: Ticket[] = await prisma.ticket.findMany({
        where: {
            enrollmentId: enrollmentId
        }
    })
    return ticket;
}

async function getTicket(userId: number) {
    const enrollmentData: Enrollment = await getEnrollmentByUserId(userId);
    const ticket: Ticket[] = await ticketByEnrollmentId(enrollmentData.id);
    const ticketType: TicketType = await ticketTypeByTicketTypeId(ticket[0].ticketTypeId);

    const finalTicket: CompletTicket = {
        id: ticket[0].id,
        status: ticket[0].status,
        ticketTypeId: ticketType.id,
        enrollmentId: enrollmentData.id,
        TicketType: {
            id: ticketType.id,
            name: ticketType.name,
            price: ticketType.price,
            isRemote: ticketType.isRemote,
            includesHotel: ticketType.includesHotel,
            createdAt: ticketType.createdAt,
            updatedAt: ticketType.updatedAt
        },
        createdAt: ticket[0].createdAt,
        updatedAt: ticket[0].updatedAt
    }

    return finalTicket;
}

async function createNewTicket(ticketTypeId: TicketTypeId, userId: number) {
    const enrollmentData: Enrollment = await getEnrollmentByUserId(userId);
    const ticketType: TicketType = await ticketTypeByTicketTypeId(ticketTypeId.ticketTypeId);

    const type = ticketTypeId.ticketTypeId as number;
    const dia = Date.now();
    const hoje = new Date(dia).toISOString();
    await prisma.ticket.create({
        data: {
            ticketTypeId: type,
            enrollmentId: enrollmentData.id,
            status: 'RESERVED',
            updatedAt: hoje
        }
    })

    const ticket: Ticket[] = await ticketByEnrollmentId(enrollmentData.id);

    const finalTicket: CompletTicket = {
        id: ticket[0].id,
        status: ticket[0].status,
        ticketTypeId: type,
        enrollmentId: enrollmentData.id,
        TicketType: {
            id: ticketType.id,
            name: ticketType.name,
            price: ticketType.price,
            isRemote: ticketType.isRemote,
            includesHotel: ticketType.includesHotel,
            createdAt: ticketType.createdAt,
            updatedAt: ticketType.updatedAt
        },
        createdAt: ticket[0].createdAt,
        updatedAt: ticket[0].updatedAt
    }

    return finalTicket;
}

async function  getTicketByTicketId(ticketId: number) {
    const ticket = await prisma.ticket.findUnique({
        where: {
            id: ticketId
        }
    })

    return ticket;
}

async function updateTicketPayment(ticketId: number) {
    const dia = Date.now();
    const hoje = new Date(dia).toISOString();

    const ticket = await prisma.ticket.update({
        where: {
            id: ticketId
        },
        data: {
            status: 'PAID',
            updatedAt: hoje
        }
    })
}

const ticketRepository = {
    getTicketsTypes,
    ticketTypeByTicketTypeId,
    getTicket,
    getTicketByTicketId,
    createNewTicket,
    updateTicketPayment
};

export default ticketRepository;