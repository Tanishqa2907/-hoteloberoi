import { useState } from 'react';
import { Room, RoomType, ROOM_CONFIGS, Guest } from '@/types/hotel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Mail, Calendar, BedDouble, CheckCircle } from 'lucide-react';

interface BookingFormProps {
  rooms: Room[];
  getAvailableRooms: (type?: RoomType) => Room[];
  onCheckIn: (guestData: Omit<Guest, 'id' | 'totalBill'>) => Promise<{ success: boolean; message: string }>;
  preselectedRoomId?: number;
}

export const BookingForm = ({ rooms, getAvailableRooms, onCheckIn, preselectedRoomId }: BookingFormProps) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<RoomType | ''>('');
  const [selectedRoom, setSelectedRoom] = useState<string>(preselectedRoomId?.toString() || '');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    email: '',
    numberOfDays: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const availableRooms = selectedType ? getAvailableRooms(selectedType) : getAvailableRooms();
  const selectedRoomData = rooms.find(r => r.id === parseInt(selectedRoom));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRoom) {
      toast({ title: 'Error', description: 'Please select a room', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onCheckIn({
        firstName: formData.firstName,
        lastName: formData.lastName,
        contact: formData.contact,
        email: formData.email,
        roomId: parseInt(selectedRoom),
        checkInDate: new Date(),
        numberOfDays: formData.numberOfDays,
      });

      if (result.success) {
        setBookingSuccess(true);
        
        // Reset form after delay
        setTimeout(() => {
          setFormData({ firstName: '', lastName: '', contact: '', email: '', numberOfDays: 1 });
          setSelectedRoom('');
          setSelectedType('');
          setBookingSuccess(false);
        }, 2000);
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'An unexpected error occurred. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="animate-scale-in flex flex-col items-center justify-center min-h-[400px] glass-card rounded-xl p-8">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-center">Booking Confirmed!</h3>
        <p className="text-muted-foreground text-center mt-2">
          {formData.firstName} {formData.lastName} has been checked into Room {selectedRoom}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-serif text-3xl font-bold">New Booking</h2>
        <p className="text-muted-foreground">Register a new guest and assign a room</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-card rounded-xl p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="w-4 h-4 text-gold" />
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                required
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
                required
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                Contact Number
              </Label>
              <Input
                id="contact"
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="+91 98765 43210"
                required
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-gold" />
                Room Type
              </Label>
              <Select value={selectedType} onValueChange={(value) => {
                setSelectedType(value as RoomType);
                setSelectedRoom('');
              }}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_CONFIGS.map((config) => (
                    <SelectItem key={config.type} value={config.type}>
                      {config.label} - ₹{config.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Room Number</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      Room {room.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="days" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                Number of Days
              </Label>
              <Input
                id="days"
                type="number"
                min="1"
                max="30"
                value={formData.numberOfDays}
                onChange={(e) => setFormData({ ...formData, numberOfDays: parseInt(e.target.value) || 1 })}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Complete Check-In'}
          </Button>
        </form>

        {/* Summary */}
        <div className="glass-card rounded-xl p-6 h-fit">
          <h3 className="font-serif text-lg font-semibold mb-4">Booking Summary</h3>
          
          {selectedRoomData ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                <p className="text-sm text-muted-foreground">Selected Room</p>
                <p className="font-serif text-2xl font-bold text-gold">Room {selectedRoomData.id}</p>
                <p className="text-sm">{ROOM_CONFIGS.find(c => c.type === selectedRoomData.type)?.label}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate per night</span>
                  <span>₹{selectedRoomData.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{formData.numberOfDays} night(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{selectedRoomData.price * formData.numberOfDays}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (12%)</span>
                  <span>₹{Math.round(selectedRoomData.price * formData.numberOfDays * 0.12)}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-gold">
                    ₹{Math.round(selectedRoomData.price * formData.numberOfDays * 1.12)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Select a room to see the summary</p>
          )}
        </div>
      </div>
    </div>
  );
};
