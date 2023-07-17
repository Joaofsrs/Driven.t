import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
    createEnrollmentWithAddress,
    createUser,
    createTicketType,
    createTicket,
    generateCreditCardData,
    createHotel,
    createRoom,
    createPayment
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';
import { number } from 'joi';


beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotels/', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels/');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 if enrollment dont exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 if ticket dont exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);

            const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 if hotel dont exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
        it('should respond with status 402 if ticket is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType({ isRemote: true, includesHotel: true });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            await createHotel();
            await createHotel();

            const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });
        it('should respond with status 402 if ticket dont includes hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType({ isRemote: false, includesHotel: false });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            await createHotel();
            await createHotel();

            const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });
        it('should respond with status 402 if dont have a payment', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            await createHotel();
            await createHotel();

            const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });
        it('should respond with status 200 and with hotel list data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel1 = await createHotel();
            const hotel2 = await createHotel();
            await createPayment(ticket.id, 15);

            const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual([
                {
                    id: hotel1.id,
                    name: hotel1.name,
                    image: hotel1.image,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                },
                {
                    id: hotel2.id,
                    name: hotel2.name,
                    image: hotel2.image,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            ]);
        });
    });
});


describe('GET /hotels/:hotelId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const hotel = await createHotel();

        const response = await server.get(`/hotels/${hotel.id}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const hotel = await createHotel();

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        const hotel = await createHotel();

        const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 if enrollment dont exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get(`/hotels/4`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 if ticket dont exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);

            const response = await server.get(`/hotels/4`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 if hotel dont exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get(`/hotels/4`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
        it('should respond with status 402 if ticket is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType({ isRemote: true, includesHotel: true });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });
        it('should respond with status 402 if ticket dont includes hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType({ isRemote: false, includesHotel: false });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });
        it('should respond with status 402 if dont have a payment', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });
        it('should respond with status 404 if hotelId is a string', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();
            const room = await createRoom({hotelId: hotel.id});
            await createPayment(ticket.id, 15);

            const response = await server.get(`/hotels/teste`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
        it('should respond with status 404 if hotelId dont exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();
            const room = await createRoom({hotelId: hotel.id});
            await createPayment(ticket.id, 15);

            const response = await server.get(`/hotels/${hotel.id+1}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
        it('should respond with status 200 and with hotel rooms data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const hotel = await createHotel();
            const room = await createRoom({hotelId: hotel.id});
            await createPayment(ticket.id, 15);

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual(
                {
                    id: hotel.id,
                    name: hotel.name,
                    image: hotel.image,
                    createdAt: hotel.createdAt.toISOString(),
                    updatedAt: hotel.updatedAt.toISOString(),
                    Rooms: [
                        {
                            id: room.id,
                            name: room.name,
                            capacity: room.capacity,
                            hotelId: room.hotelId,
                            createdAt: room.createdAt.toISOString(),
                            updatedAt: room.updatedAt.toISOString(),
                        }
                    ]
                }
            );
        });
    });
});