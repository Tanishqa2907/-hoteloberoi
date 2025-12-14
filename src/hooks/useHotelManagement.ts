import { useState, useCallback } from 'react';
import { Room, Guest, RoomType, ROOM_CONFIGS, GST_RATE } from '@/types/hotel';

const initializeRooms = (): Room[] => {
  const rooms: Room[] = [];
  
  // Rooms 1-5: Non-AC (Standard)
  for (let i = 1; i <= 5; i++) {
    rooms.push({ id: i, type: 'non-ac', price: 2000, isOccupied: false });
  }
  
  // Rooms 6-10: AC (Deluxe)
  for (let i = 6; i <= 10; i++) {
    rooms.push({ id: i, type: 'ac', price: 2500, isOccupied: false });
  }
  
  // Rooms 11-15: Premium Suite
  for (let i = 11; i <= 15; i++) {
    rooms.push({ id: i, type: 'premium', price: 3000, isOccupied: false });
  }
  
  return rooms;
};

export const useHotelManagement = () => {
  const [rooms, setRooms] = useState<Room[]>(initializeRooms);
  const [guests, setGuests] = useState<Guest[]>([]);

  const getAvailableRooms = useCallback((type?: RoomType) => {
    return rooms.filter(room => !room.isOccupied && (type ? room.type === type : true));
  }, [rooms]);

  const getOccupiedRooms = useCallback(() => {
    return rooms.filter(room => room.isOccupied);
  }, [rooms]);

  const getRoomById = useCallback((roomId: number) => {
    return rooms.find(room => room.id === roomId);
  }, [rooms]);

  const getGuestByRoomId = useCallback((roomId: number) => {
    return guests.find(guest => guest.roomId === roomId);
  }, [guests]);

  const checkIn = useCallback((guestData: Omit<Guest, 'id' | 'totalBill'>) => {
    const room = getRoomById(guestData.roomId);
    if (!room || room.isOccupied) {
      return { success: false, message: 'Room is not available' };
    }

    const newGuest: Guest = {
      ...guestData,
      id: crypto.randomUUID(),
    };

    setGuests(prev => [...prev, newGuest]);
    setRooms(prev => prev.map(r => 
      r.id === guestData.roomId ? { ...r, isOccupied: true } : r
    ));

    return { success: true, message: 'Check-in successful', guest: newGuest };
  }, [getRoomById]);

  const checkOut = useCallback((roomId: number) => {
    const guest = getGuestByRoomId(roomId);
    const room = getRoomById(roomId);
    
    if (!guest || !room) {
      return { success: false, message: 'Guest not found' };
    }

    const baseAmount = room.price * guest.numberOfDays;
    const gstAmount = baseAmount * GST_RATE;
    const totalBill = baseAmount + gstAmount;

    const billDetails = {
      guestName: `${guest.firstName} ${guest.lastName}`,
      roomId: room.id,
      roomType: ROOM_CONFIGS.find(c => c.type === room.type)?.label,
      pricePerDay: room.price,
      numberOfDays: guest.numberOfDays,
      baseAmount,
      gstAmount,
      gstRate: GST_RATE * 100,
      totalBill,
      checkInDate: guest.checkInDate,
    };

    setGuests(prev => prev.filter(g => g.id !== guest.id));
    setRooms(prev => prev.map(r => 
      r.id === roomId ? { ...r, isOccupied: false } : r
    ));

    return { success: true, message: 'Check-out successful', billDetails };
  }, [getGuestByRoomId, getRoomById]);

  const searchGuest = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return guests.filter(guest => 
      guest.firstName.toLowerCase().includes(lowerQuery) ||
      guest.lastName.toLowerCase().includes(lowerQuery) ||
      guest.roomId.toString() === query
    );
  }, [guests]);

  const stats = {
    totalRooms: rooms.length,
    occupiedRooms: rooms.filter(r => r.isOccupied).length,
    availableRooms: rooms.filter(r => !r.isOccupied).length,
    totalGuests: guests.length,
    occupancyRate: Math.round((rooms.filter(r => r.isOccupied).length / rooms.length) * 100),
  };

  return {
    rooms,
    guests,
    stats,
    getAvailableRooms,
    getOccupiedRooms,
    getRoomById,
    getGuestByRoomId,
    checkIn,
    checkOut,
    searchGuest,
  };
};
