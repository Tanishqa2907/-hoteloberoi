import { Room, Guest } from '@/types/hotel';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new ApiError(response.status, error.error || 'An error occurred');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error. Please check if the server is running.');
  }
}

export const api = {
  // Rooms
  getRooms: async (): Promise<Room[]> => {
    const rooms = await fetchApi<Room[]>('/api/rooms');
    return rooms.map(room => ({
      ...room,
      isOccupied: Boolean(room.isOccupied),
    }));
  },

  // Guests
  getGuests: async (): Promise<Guest[]> => {
    const guests = await fetchApi<Guest[]>('/api/guests');
    return guests.map(guest => ({
      ...guest,
      checkInDate: new Date(guest.checkInDate),
    }));
  },

  // Stats
  getStats: async (): Promise<{
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    totalGuests: number;
    occupancyRate: number;
  }> => {
    return fetchApi('/api/stats');
  },

  // Bookings
  createBooking: async (guestData: {
    firstName: string;
    lastName: string;
    contact: string;
    email: string;
    roomId: number;
    checkInDate: Date;
    numberOfDays: number;
  }): Promise<{ success: boolean; message: string; guest: Guest }> => {
    return fetchApi('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        ...guestData,
        checkInDate: guestData.checkInDate.toISOString(),
      }),
    });
  },

  // Checkout
  checkout: async (roomId: number): Promise<{
    success: boolean;
    message: string;
    billDetails: {
      guestName: string;
      roomId: number;
      roomType: string;
      pricePerDay: number;
      numberOfDays: number;
      baseAmount: number;
      gstAmount: number;
      gstRate: number;
      totalBill: number;
      checkInDate: Date;
    };
  }> => {
    const result = await fetchApi<{
      success: boolean;
      message: string;
      billDetails: {
        guestName: string;
        roomId: number;
        roomType: string;
        pricePerDay: number;
        numberOfDays: number;
        baseAmount: number;
        gstAmount: number;
        gstRate: number;
        totalBill: number;
        checkInDate: string;
      };
    }>(`/api/checkout/${roomId}`, {
      method: 'POST',
    });

    return {
      ...result,
      billDetails: {
        ...result.billDetails,
        checkInDate: new Date(result.billDetails.checkInDate),
      },
    };
  },
};

export { ApiError };

