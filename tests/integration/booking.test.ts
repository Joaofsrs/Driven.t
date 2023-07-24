import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { createUser, createHotel, createRoomWithHotelId, createEnrollmentWithAddress, createTicketType, createTicket, createTicketTypeWithHotel, createTicketTypeRemote } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';
import { createBooking } from '../factories/booking-factory';
import { TicketStatus } from '.prisma/client';


beforeAll(async () => {
    await init();
});
  
beforeEach(async () => {
    await cleanDb();
});
  
const server = supertest(app);
  
describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');
  
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
      it('should respond with status 404 if user dont have a booking', async () => {
        const token = await generateValidToken();
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.NOT_FOUND);
      });

      it('should respond with status 200 and booking', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel(); 
        const room = await createRoomWithHotelId(hotel.id);
        createBooking(user.id, room.id);
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual({
            id: expect.any(Number),
            Room: {
                id: room.id,
                name: room.name,
                capacity: room.capacity,
                hotelId: room.hotelId,
                createdAt: room.createdAt.toISOString(),
                updatedAt: room.updatedAt.toISOString()
              }
        });
      });
    });
});

 
describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking');
  
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
        it('should respond with status 404 if the room dont exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      
            const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`);
    
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });
        it('should respond with status 403 if tiket is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel(); 
            const room = await createRoomWithHotelId(hotel.id);
      
            const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId: room.id});
    
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 if room is its already busy', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel(); 
            const room = await createRoomWithHotelId(hotel.id);
            await createBooking(user.id, room.id)
      
            const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId: room.id });
    
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 200', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel(); 
            const room = await createRoomWithHotelId(hotel.id);
      
            const response = await server.post('/booking')
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId: room.id });
    
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                bookingId: expect.any(Number)
            })
        });
    });
});

describe('PUT /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.put('/booking/teste');
  
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.put('/booking/teste').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.put('/booking/teste').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
        it('should respond with status 403 if the bookingId is invalid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      
            const response = await server.put('/booking/teste')
            .set('Authorization', `Bearer ${token}`);
    
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });
        it('should respond with status 403 if its a wrong bookingId', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel(); 
            const room = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id)
      
            const response = await server.put(`/booking/${booking.id+3}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId: room.id});
    
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 403 if room is its already busy', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel(); 
            const room = await createRoomWithHotelId(hotel.id);
            const room2 = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id);
            const booking2 = await createBooking(user.id, room2.id)
      
            const response = await server.put(`/booking/${booking.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId: room2.id });
    
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 404 if room is its already busy', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel(); 
            const room = await createRoomWithHotelId(hotel.id);
            const room2 = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id);
            const booking2 = await createBooking(user.id, room2.id)
      
            const response = await server.put(`/booking/${booking.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId: room2.id });
    
            expect(response.status).toEqual(httpStatus.FORBIDDEN);
        });

        it('should respond with status 404 if room is its already busy', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel(); 
            const room = await createRoomWithHotelId(hotel.id);
            const room2 = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id);
            const booking2 = await createBooking(user.id, room2.id)
      
            const response = await server.put(`/booking/${booking.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId: room2.id+5 });
    
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel(); 
            const room = await createRoomWithHotelId(hotel.id);
            const room2 = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id)
      
            const response = await server.put(`/booking/${booking.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ roomId: room2.id });
    
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({
                bookingId: expect.any(Number)
            })
        });
    });
});