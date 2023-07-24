import { ApplicationError } from '@/protocols';

export function invalidBooking(): ApplicationError {
  return {
    name: 'InvalidBooking',
    message: 'User doesnt have a reservation',
  };
}

export function invalidBookingId(): ApplicationError {
    return {
      name: 'InvalidBookingId',
      message: 'Invalid BookingId',
    };
}


export function invalidRoomId(): ApplicationError {
    return {
      name: 'InvalidRoomId',
      message: 'Invalid RoomId',
    };
}

export function fullRoom(): ApplicationError {
    return {
      name: 'FullRoom',
      message: 'The room has no vacancy',
    };
}  

export function ruleRoom(): ApplicationError {
    return {
      name: 'RuleRoom',
      message: 'The user broke the room rule',
    };
}  