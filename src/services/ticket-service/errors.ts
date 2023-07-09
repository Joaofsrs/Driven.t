import { ApplicationError } from '@/protocols';

export function ticketTypeUnexisting(): ApplicationError {
  return {
    name: 'TicketTypeUnexisting',
    message: 'Thist ticket type does not exist',
  };
}

export function userDontHaveTicket(): ApplicationError {
  return {
    name: 'UserDontHaveTicket',
    message: 'Thist user dont have a ticket',
  };
}
