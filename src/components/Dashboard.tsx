import { Room, Guest, ROOM_CONFIGS } from '@/types/hotel';
import { StatsCard } from './StatsCard';
import { RoomCard } from './RoomCard';
import { BedDouble, Users, DoorOpen, Percent, TrendingUp } from 'lucide-react';

interface DashboardProps {
  rooms: Room[];
  guests: Guest[];
  stats: {
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    totalGuests: number;
    occupancyRate: number;
  };
  onCheckOut: (roomId: number) => Promise<{ success: boolean; message: string; billDetails?: any }>;
  getGuestByRoomId: (roomId: number) => Guest | undefined;
}

export const Dashboard = ({ rooms, guests, stats, onCheckOut, getGuestByRoomId }: DashboardProps) => {
  const recentGuests = guests.slice(-3);
  const occupiedRooms = rooms.filter(r => r.isOccupied).slice(0, 3);

  const todayRevenue = guests.reduce((acc, guest) => {
    const room = rooms.find(r => r.id === guest.roomId);
    return acc + (room?.price || 0) * guest.numberOfDays;
  }, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center md:text-left">
        <h2 className="font-serif text-3xl md:text-4xl font-bold">
          Welcome to <span className="text-gradient">Grand Luxe</span>
        </h2>
        <p className="text-muted-foreground mt-2">Manage your hotel operations with elegance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Rooms"
          value={stats.totalRooms}
          subtitle="All categories"
          icon={BedDouble}
          className="animate-slide-up stagger-1"
        />
        <StatsCard
          title="Occupied"
          value={stats.occupiedRooms}
          subtitle={`${stats.occupancyRate}% occupancy`}
          icon={DoorOpen}
          trend="up"
          className="animate-slide-up stagger-2"
        />
        <StatsCard
          title="Available"
          value={stats.availableRooms}
          subtitle="Ready for booking"
          icon={Users}
          className="animate-slide-up stagger-3"
        />
        <StatsCard
          title="Est. Revenue"
          value={`₹${todayRevenue.toLocaleString()}`}
          subtitle="Current bookings"
          icon={TrendingUp}
          trend="up"
          className="animate-slide-up stagger-4"
        />
      </div>

      {/* Room Type Summary */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-serif text-xl font-semibold mb-4">Room Categories</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {ROOM_CONFIGS.map((config) => {
            const typeRooms = rooms.filter(r => r.type === config.type);
            const available = typeRooms.filter(r => !r.isOccupied).length;
            const total = typeRooms.length;
            
            return (
              <div key={config.type} className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{config.label}</span>
                  <span className="text-gold font-serif font-bold">₹{config.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
                      style={{ width: `${((total - available) / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{available}/{total}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Currently Occupied */}
      {occupiedRooms.length > 0 && (
        <div>
          <h3 className="font-serif text-xl font-semibold mb-4">Currently Occupied</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {occupiedRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                guest={getGuestByRoomId(room.id)}
                onCheckOut={onCheckOut}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
