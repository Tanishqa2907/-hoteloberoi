export type RoomType = 'non-ac' | 'ac' | 'premium';

export interface Room {
  id: number;
  type: RoomType;
  price: number;
  isOccupied: boolean;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  contact: string;
  email: string;
  roomId: number;
  checkInDate: Date;
  numberOfDays: number;
  totalBill?: number;
}

export interface RoomConfig {
  type: RoomType;
  label: string;
  price: number;
  description: string;
  amenities: string[];
}

export const ROOM_CONFIGS: RoomConfig[] = [
  {
    type: 'non-ac',
    label: 'Standard',
    price: 2000,
    description: 'Comfortable room with essential amenities',
    amenities: ['Free WiFi', 'TV', 'Room Service', 'Daily Housekeeping'],
  },
  {
    type: 'ac',
    label: 'Deluxe',
    price: 2500,
    description: 'Air-conditioned room with premium comfort',
    amenities: ['Free WiFi', 'Smart TV', 'Air Conditioning', 'Mini Bar', 'Room Service'],
  },
  {
    type: 'premium',
    label: 'Premium Suite',
    price: 3000,
    description: 'Luxurious suite with exclusive services',
    amenities: ['Free WiFi', '4K Smart TV', 'Climate Control', 'Mini Bar', 'Butler Service', 'Jacuzzi'],
  },
];

export const GST_RATE = 0.12;
