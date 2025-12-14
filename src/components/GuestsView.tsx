import { useState } from 'react';
import { Room, Guest, ROOM_CONFIGS, GST_RATE } from '@/types/hotel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, User, Phone, Mail, Calendar, Receipt, Printer, LogOut } from 'lucide-react';

interface GuestsViewProps {
  guests: Guest[];
  rooms: Room[];
  getRoomById: (roomId: number) => Room | undefined;
  onCheckOut: (roomId: number) => { 
    success: boolean; 
    message: string; 
    billDetails?: {
      guestName: string;
      roomId: number;
      roomType?: string;
      pricePerDay: number;
      numberOfDays: number;
      baseAmount: number;
      gstAmount: number;
      gstRate: number;
      totalBill: number;
      checkInDate: Date;
    };
  };
}

export const GuestsView = ({ guests, rooms, getRoomById, onCheckOut }: GuestsViewProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [billDialog, setBillDialog] = useState<{
    open: boolean;
    details?: {
      guestName: string;
      roomId: number;
      roomType?: string;
      pricePerDay: number;
      numberOfDays: number;
      baseAmount: number;
      gstAmount: number;
      gstRate: number;
      totalBill: number;
      checkInDate: Date;
    };
  }>({ open: false });

  const filteredGuests = guests.filter(guest => 
    guest.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.roomId.toString().includes(searchQuery) ||
    guest.contact.includes(searchQuery)
  );

  const handleCheckOut = (roomId: number) => {
    const result = onCheckOut(roomId);
    if (result.success && result.billDetails) {
      setBillDialog({ open: true, details: result.billDetails });
      toast({ title: 'Check-out Complete', description: 'Bill has been generated' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold">Current Guests</h2>
          <p className="text-muted-foreground">{guests.length} guest(s) currently staying</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, room, or contact..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary border-border"
        />
      </div>

      {/* Guests List */}
      {filteredGuests.length > 0 ? (
        <div className="grid gap-4">
          {filteredGuests.map((guest, index) => {
            const room = getRoomById(guest.roomId);
            const config = ROOM_CONFIGS.find(c => c.type === room?.type);
            const estimatedBill = room ? Math.round(room.price * guest.numberOfDays * 1.12) : 0;

            return (
              <div 
                key={guest.id} 
                className="glass-card rounded-xl p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center shrink-0">
                      <User className="w-7 h-7 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold">
                        {guest.firstName} {guest.lastName}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {guest.contact}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {guest.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 lg:gap-8">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Room</p>
                      <p className="font-serif text-xl font-bold text-gold">{guest.roomId}</p>
                      <p className="text-xs text-muted-foreground">{config?.label}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Check-in</p>
                      <p className="font-medium">{new Date(guest.checkInDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
                      <p className="font-medium">{guest.numberOfDays} night(s)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Est. Bill</p>
                      <p className="font-serif text-lg font-bold text-gold">₹{estimatedBill.toLocaleString()}</p>
                    </div>
                    <Button variant="gold-outline" onClick={() => handleCheckOut(guest.roomId)}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Check Out
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-serif text-xl font-semibold mb-2">No Guests Found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'No guests match your search criteria' : 'No guests are currently staying at the hotel'}
          </p>
        </div>
      )}

      {/* Bill Dialog */}
      <Dialog open={billDialog.open} onOpenChange={(open) => setBillDialog({ ...billDialog, open })}>
        <DialogContent className="glass-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl flex items-center gap-2">
              <Receipt className="w-6 h-6 text-gold" />
              Invoice
            </DialogTitle>
            <DialogDescription>Checkout bill for {billDialog.details?.guestName}</DialogDescription>
          </DialogHeader>
          
          {billDialog.details && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                <div className="flex justify-between items-center">
                  <span>Room {billDialog.details.roomId}</span>
                  <span className="text-gold font-medium">{billDialog.details.roomType}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in Date</span>
                  <span>{new Date(billDialog.details.checkInDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate per Night</span>
                  <span>₹{billDialog.details.pricePerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of Nights</span>
                  <span>{billDialog.details.numberOfDays}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{billDialog.details.baseAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST ({billDialog.details.gstRate}%)</span>
                  <span>₹{Math.round(billDialog.details.gstAmount).toLocaleString()}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-gold font-serif text-xl">₹{Math.round(billDialog.details.totalBill).toLocaleString()}</span>
                </div>
              </div>

              <Button variant="gold" className="w-full" onClick={() => setBillDialog({ open: false })}>
                <Printer className="w-4 h-4 mr-2" />
                Print & Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
