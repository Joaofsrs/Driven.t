import faker from '@faker-js/faker';
import { TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType(params: Partial<TicketType> = {}) {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: params.isRemote ? true : false,
      includesHotel: params.includesHotel ? true : false
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}
