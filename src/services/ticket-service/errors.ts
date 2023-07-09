import { ApplicationError } from '@/protocols';

export function ticketTypeUnexisting(): ApplicationError {
  return {
    name: 'TicketTypeUnexisting',
    message: 'Thist ticket type does not exist',
  };
}
