import { PaymentsProcess } from "@/protocols";
import ticketRepository from "@/repositories/ticket-repository";
import { ticketDontBelong, ticketDontExist, ticketIdDontSend } from "./errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import paymentsRepository from "@/repositories/payments-repository";
import { Enrollment, Payment, Ticket } from "@prisma/client";

async function getPayments(ticketId: string, userId: number) {
    const ticketIdNumber: number = Number(ticketId)
    if(!ticketId){
        throw ticketIdDontSend(); //400
    }
    if(isNaN(ticketIdNumber)){
        throw ticketDontExist(); //404
    }
    const ticketExist: Ticket = await ticketRepository.getTicketByTicketId(ticketIdNumber);
    if(!ticketExist){
        throw ticketDontExist(); //404
    }
    const enrollmentData: Enrollment = await enrollmentRepository.getEnrollmentById(ticketExist.enrollmentId);
    if(enrollmentData.userId !== userId){
        throw ticketDontBelong(); //401
    }

    const result: Payment = await paymentsRepository.getPaymentsByTicketId(ticketIdNumber);

    return result;
}

async function createPaymentsProcess(body: PaymentsProcess, userId: number){
    const ticketExist: Ticket = await ticketRepository.getTicketByTicketId(body.ticketId);
    if(!ticketExist){
        throw ticketDontExist(); //404
    }
    const enrollmentData: Enrollment = await enrollmentRepository.getEnrollmentById(ticketExist.enrollmentId);
    if(enrollmentData.userId !== userId){
        throw ticketDontExist(); //401
    }

    const result = await paymentsRepository.createPaymentsProcess(body, userId, ticketExist.ticketTypeId);
    await ticketRepository.updateTicketPayment(ticketExist.id)

    return result;
}

const paymentsService = {
    createPaymentsProcess,
    getPayments
};

export default paymentsService;