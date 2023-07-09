import { PaymentsProcess } from "@/protocols";
import { prisma } from '@/config';
import ticketRepository from "../ticket-repository";
import { Payment } from "@prisma/client";

async function getPaymentsByTicketId(ticketId: number) {
    const result: Payment[] = await prisma.payment.findMany({
        where:{
            ticketId
        }
    });
    return result[0];
}

async function createPaymentsProcess(body: PaymentsProcess, userId: number, ticketTypeId: number){
    const ticketType = await ticketRepository.ticketTypeByTicketTypeId(ticketTypeId);

    const dia = Date.now();
    const hoje = new Date(dia).toISOString();
    const lastDigits: string = body.cardData.number.toString(4)
    console.log(lastDigits);
    await prisma.payment.create({
        data:{
            ticketId: body.ticketId,
            value: ticketType.price,
            cardIssuer: body.cardData.issuer,
            cardLastDigits: lastDigits,
            updatedAt: hoje 
        }
    })
    const result: Payment = await getPaymentsByTicketId(body.ticketId);

    return result;
}


const paymentsRepository = {
    createPaymentsProcess,
    getPaymentsByTicketId
};

export default paymentsRepository;