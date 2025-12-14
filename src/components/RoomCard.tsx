import { Room, Guest, ROOM_CONFIGS } from '@/types/hotel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Wifi, Tv, Wind, Wine, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  room: Room;
  guest?: Guest;
  onCheckOut?: (roomId: number) => void;
  onBook?: (roomId: number) => void;
  showActions?: boolean;
}

const amenityIcons: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi className="w-3 h-3" />,
  'TV': <Tv className="w-3 h-3" />,
  'Smart TV': <Tv className="w-3 h-3" />,
  '4K Smart TV': <Tv className="w-3 h-3" />,
  'Air Conditioning': <Wind className="w-3 h-3" />,
  'Climate Control': <Wind className="w-3 h-3" />,
  'Mini Bar': <Wine className="w-3 h-3" />,
  'Butler Service': <Sparkles className="w-3 h-3" />,
};

export const RoomCard = ({ room, guest, onCheckOut, onBook, showActions = true }: RoomCardProps) => {
  const config = ROOM_CONFIGS.find(c => c.type === room.type);

  return (
    <div className={cn(
      "glass-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl",
      room.isOccupied && "border-gold/30"
    )}>
      {/* Header */}
      <div className={cn(
        "px-5 py-4 border-b border-border/50",
        room.isOccupied ? "bg-gold/10" : "bg-secondary/50"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-semibold">Room {room.id}</span>
              <Badge variant={room.isOccupied ? "default" : "secondary"} className={cn(
                room.isOccupied && "bg-gold text-primary-foreground"
              )}>
                {room.isOccupied ? 'Occupied' : 'Available'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{config?.label}</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-xl font-bold text-gold">₹{room.price}</p>
            <p className="text-xs text-muted-foreground">per night</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {room.isOccupied && guest ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <User className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-medium">{guest.firstName} {guest.lastName}</p>
                <p className="text-sm text-muted-foreground">{guest.contact}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Check-in</p>
                <p className="font-medium">{new Date(guest.checkInDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">{guest.numberOfDays} night{guest.numberOfDays > 1 ? 's' : ''}</p>
              </div>
            </div>
            {showActions && onCheckOut && (
              <Button
                variant="gold-outline"
                className="w-full mt-2"
                onClick={() => onCheckOut(room.id)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Check Out
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{config?.description}</p>
            <div className="flex flex-wrap gap-2">
              {config?.amenities.slice(0, 4).map((amenity) => (
                <span key={amenity} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                  {amenityIcons[amenity]}
                  {amenity}
                </span>
              ))}
            </div>
            {showActions && onBook && (
              <Button
                variant="gold"
                className="w-full mt-2"
                onClick={() => onBook(room.id)}
              >
                Book Now
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
