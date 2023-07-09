import { ApplicationError } from '@/protocols';

export function ticketDontExist(): ApplicationError {
  return {
    name: 'TicketUnexisting',
    message: 'This ticket does not exist',
  };
}

export function ticketDontBelong(): ApplicationError {
    return {
      name: 'TicketDontBelongToThisUser',
      message: 'This ticket does not belong to this user',
    };
}

export function ticketIdDontSend(): ApplicationError {
    return {
      name: 'TicketIdDontSend',
      message: 'The user dont send a ticket id',
    };
}
  