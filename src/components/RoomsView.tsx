import { useState } from 'react';
import { Room, Guest, RoomType, ROOM_CONFIGS } from '@/types/hotel';
import { RoomCard } from './RoomCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface RoomsViewProps {
  rooms: Room[];
  getGuestByRoomId: (roomId: number) => Guest | undefined;
  onCheckOut: (roomId: number) => Promise<{ success: boolean; message: string; billDetails?: any }>;
  onBook: (roomId: number) => void;
}

export const RoomsView = ({ rooms, getGuestByRoomId, onCheckOut, onBook }: RoomsViewProps) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'occupied'>('all');
  const [typeFilter, setTypeFilter] = useState<RoomType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = rooms.filter(room => {
    const matchesStatus = 
      filter === 'all' || 
      (filter === 'available' && !room.isOccupied) || 
      (filter === 'occupied' && room.isOccupied);
    
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    
    const matchesSearch = 
      searchQuery === '' || 
      room.id.toString().includes(searchQuery) ||
      (room.isOccupied && getGuestByRoomId(room.id)?.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (room.isOccupied && getGuestByRoomId(room.id)?.lastName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">All Rooms</h2>
          <p className="text-muted-foreground">Manage and view room status</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by room number or guest name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['all', 'available', 'occupied'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'gold' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            <Button
              variant={typeFilter === 'all' ? 'gold' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter('all')}
            >
              All Types
            </Button>
            {ROOM_CONFIGS.map((config) => (
              <Button
                key={config.type}
                variant={typeFilter === config.type ? 'gold' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter(config.type)}
              >
                {config.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room, index) => (
          <div key={room.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
            <RoomCard
              room={room}
              guest={getGuestByRoomId(room.id)}
              onCheckOut={onCheckOut}
              onBook={onBook}
            />
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No rooms match your criteria</p>
        </div>
      )}
    </div>
  );
};
