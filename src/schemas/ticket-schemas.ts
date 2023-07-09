import { TicketTypeId } from '@/protocols';
import Joi from 'joi';

export const createTicketsSchema = Joi.object<TicketTypeId>({
    ticketTypeId: Joi.number().required(),
});
