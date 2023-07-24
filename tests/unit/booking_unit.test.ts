import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import bookingService from "@/services/booking-service";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import dayjs from "dayjs";


beforeEach(() => {
    jest.clearAllMocks();
});

describe("POST booking test", () => {
    it("should post without enrollment", async () => {
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return undefined;
        });

        const booking = bookingService.postBooking(3, 4);
        expect(booking).rejects.toEqual({
            name: 'RuleRoom',
            message: 'The user broke the room rule',
        });
    });
    it("should post without ticket", async () => {
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return {
                name: faker.name.findName(),
                cpf: "123.123.123-12",
                birthday: faker.date.past(),
                phone: faker.phone.phoneNumber('(##) 9####-####'),
                userId: 1,
                Address: {
                    create: {
                        street: faker.address.streetName(),
                        cep: faker.address.zipCode(),
                        city: faker.address.city(),
                        neighborhood: faker.address.city(),
                        number: faker.datatype.number().toString(),
                        state: "DF",
                    },
                },
            }
        });
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return undefined;
        });

        const booking = bookingService.postBooking(1, 4);
        expect(booking).rejects.toEqual({
            name: 'RuleRoom',
            message: 'The user broke the room rule',
        });
    });
    it("should post with remote tiket", async () => {
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return {
                id: 1,
                name: faker.name.findName(),
                cpf: "123.123.123-12",
                birthday: faker.date.past(),
                phone: faker.phone.phoneNumber('(##) 9####-####'),
                userId: 1,
                Address: {
                    create: {
                        street: faker.address.streetName(),
                        cep: faker.address.zipCode(),
                        city: faker.address.city(),
                        neighborhood: faker.address.city(),
                        number: faker.datatype.number().toString(),
                        state: "DF",
                    },
                },
            }
        });

        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                id: 1,
                enrollmentId: 1,
                ticketTypeId: 1,
                status: TicketStatus.PAID,
                TicketType: {
                    id: 1,
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: true,
                    includesHotel: false
                }
            }
        });

        const booking = bookingService.postBooking(1, 4);
        expect(booking).rejects.toEqual({
            name: 'RuleRoom',
            message: 'The user broke the room rule',
        });
    });

    it("should post with not paid ticket", async () => {
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return {
                id: 1,
                name: faker.name.findName(),
                cpf: "123.123.123-12",
                birthday: faker.date.past(),
                phone: faker.phone.phoneNumber('(##) 9####-####'),
                userId: 1,
                Address: {
                    create: {
                        street: faker.address.streetName(),
                        cep: faker.address.zipCode(),
                        city: faker.address.city(),
                        neighborhood: faker.address.city(),
                        number: faker.datatype.number().toString(),
                        state: "DF",
                    },
                },
            }
        });

        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                id: 1,
                enrollmentId: 1,
                ticketTypeId: 1,
                status: TicketStatus.RESERVED,
                TicketType: {
                    id: 1,
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true
                }
            }
        });

        const booking = bookingService.postBooking(1, 4);
        expect(booking).rejects.toEqual({
            name: 'RuleRoom',
            message: 'The user broke the room rule',
        });
    });

    it("should post with invalid roomId", async () => {
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return {
                id: 1,
                name: faker.name.findName(),
                cpf: "123.123.123-12",
                birthday: faker.date.past(),
                phone: faker.phone.phoneNumber('(##) 9####-####'),
                userId: 1,
                Address: {
                    create: {
                        street: faker.address.streetName(),
                        cep: faker.address.zipCode(),
                        city: faker.address.city(),
                        neighborhood: faker.address.city(),
                        number: faker.datatype.number().toString(),
                        state: "DF",
                    },
                },
            }
        });

        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                id: 1,
                enrollmentId: 1,
                ticketTypeId: 1,
                status: TicketStatus.PAID,
                TicketType: {
                    id: 1,
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true
                }
            }
        });

        jest.spyOn(bookingRepository, "getFullRoomById").mockImplementationOnce((): any => {
            return undefined;
        });


        const booking = bookingService.postBooking(1, 4);
        expect(booking).rejects.toEqual({
            name: 'InvalidRoomId',
            message: 'Invalid RoomId',
        });
    });
});


describe("PUT booking test", () => {
    it("should put without enrollment", async () => {
        jest.spyOn(bookingRepository, "fingBookingById").mockImplementationOnce((): any => {
            return {
                userId: 1,
                roomId: 2,
                updatedAt: dayjs().toDate()
            }
        });

        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return undefined;
        });
        
        const booking = bookingService.putBookingByRoomId(3, 4, 3);
        expect(booking).rejects.toEqual({
            name: 'RuleRoom',
            message: 'The user broke the room rule',
        });
    });
    it("should post without ticket", async () => {
        jest.spyOn(bookingRepository, "fingBookingById").mockImplementationOnce((): any => {
            return {
                userId: 1,
                roomId: 2,
                updatedAt: dayjs().toDate()
            }
        });

        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return {
                name: faker.name.findName(),
                cpf: "123.123.123-12",
                birthday: faker.date.past(),
                phone: faker.phone.phoneNumber('(##) 9####-####'),
                userId: 1,
                Address: {
                    create: {
                        street: faker.address.streetName(),
                        cep: faker.address.zipCode(),
                        city: faker.address.city(),
                        neighborhood: faker.address.city(),
                        number: faker.datatype.number().toString(),
                        state: "DF",
                    },
                },
            }
        });
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return undefined;
        });

        const booking = bookingService.putBookingByRoomId(3, 4, 3);
        expect(booking).rejects.toEqual({
            name: 'RuleRoom',
            message: 'The user broke the room rule',
        });
    });
    it("should post with remote tiket", async () => {
        jest.spyOn(bookingRepository, "fingBookingById").mockImplementationOnce((): any => {
            return {
                userId: 1,
                roomId: 2,
                updatedAt: dayjs().toDate()
            }
        });
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return {
                id: 1,
                name: faker.name.findName(),
                cpf: "123.123.123-12",
                birthday: faker.date.past(),
                phone: faker.phone.phoneNumber('(##) 9####-####'),
                userId: 1,
                Address: {
                    create: {
                        street: faker.address.streetName(),
                        cep: faker.address.zipCode(),
                        city: faker.address.city(),
                        neighborhood: faker.address.city(),
                        number: faker.datatype.number().toString(),
                        state: "DF",
                    },
                },
            }
        });

        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                id: 1,
                enrollmentId: 1,
                ticketTypeId: 1,
                status: TicketStatus.PAID,
                TicketType: {
                    id: 1,
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: true,
                    includesHotel: false
                }
            }
        });

        const booking = bookingService.putBookingByRoomId(3, 4, 3);
        expect(booking).rejects.toEqual({
            name: 'RuleRoom',
            message: 'The user broke the room rule',
        });
    });

    it("should post with remote tiket", async () => {
        jest.spyOn(bookingRepository, "fingBookingById").mockImplementationOnce((): any => {
            return {
                userId: 1,
                roomId: 2,
                updatedAt: dayjs().toDate()
            }
        });
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return {
                id: 1,
                name: faker.name.findName(),
                cpf: "123.123.123-12",
                birthday: faker.date.past(),
                phone: faker.phone.phoneNumber('(##) 9####-####'),
                userId: 1,
                Address: {
                    create: {
                        street: faker.address.streetName(),
                        cep: faker.address.zipCode(),
                        city: faker.address.city(),
                        neighborhood: faker.address.city(),
                        number: faker.datatype.number().toString(),
                        state: "DF",
                    },
                },
            }
        });

        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                id: 1,
                enrollmentId: 1,
                ticketTypeId: 1,
                status: TicketStatus.PAID,
                TicketType: {
                    id: 1,
                    name: faker.name.findName(),
                    price: faker.datatype.number(),
                    isRemote: false,
                    includesHotel: true
                }
            }
        });

        const booking = bookingService.putBookingByRoomId(3, Number("tete"), 3);
        expect(booking).rejects.toEqual({
            name: 'InvalidRoomId',
            message: 'Invalid RoomId',
        });
    });
});