import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Room, Guest, RoomType } from '@/types/hotel';
import { api, ApiError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export const useHotelManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch rooms
  const {
    data: rooms = [],
    isLoading: roomsLoading,
    error: roomsError,
  } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: api.getRooms,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch guests
  const {
    data: guests = [],
    isLoading: guestsLoading,
    error: guestsError,
  } = useQuery<Guest[]>({
    queryKey: ['guests'],
    queryFn: api.getGuests,
    refetchInterval: 30000,
  });

  // Fetch stats
  const {
    data: stats,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
    refetchInterval: 30000,
  });

  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: api.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to check in guest',
        variant: 'destructive',
      });
    },
  });

  // Check-out mutation
  const checkOutMutation = useMutation({
    mutationFn: api.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to check out guest',
        variant: 'destructive',
      });
    },
  });

  // Helper functions
  const getAvailableRooms = (type?: RoomType): Room[] => {
    return rooms.filter(room => !room.isOccupied && (type ? room.type === type : true));
  };

  const getOccupiedRooms = (): Room[] => {
    return rooms.filter(room => room.isOccupied);
  };

  const getRoomById = (roomId: number): Room | undefined => {
    return rooms.find(room => room.id === roomId);
  };

  const getGuestByRoomId = (roomId: number): Guest | undefined => {
    return guests.find(guest => guest.roomId === roomId);
  };

  const checkIn = async (guestData: Omit<Guest, 'id' | 'totalBill'>) => {
    try {
      const result = await checkInMutation.mutateAsync({
        firstName: guestData.firstName,
        lastName: guestData.lastName,
        contact: guestData.contact,
        email: guestData.email,
        roomId: guestData.roomId,
        checkInDate: guestData.checkInDate,
        numberOfDays: guestData.numberOfDays,
      });

      toast({
        title: 'Success',
        description: result.message || 'Guest checked in successfully',
      });

      return { success: true, message: result.message, guest: result.guest };
    } catch (error) {
      const apiError = error as ApiError;
      return { success: false, message: apiError.message || 'Check-in failed' };
    }
  };

  const checkOut = async (roomId: number) => {
    try {
      const result = await checkOutMutation.mutateAsync(roomId);
      return {
        success: true,
        message: result.message,
        billDetails: result.billDetails,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return { success: false, message: apiError.message || 'Check-out failed' };
    }
  };

  const searchGuest = (query: string): Guest[] => {
    const lowerQuery = query.toLowerCase();
    return guests.filter(guest =>
      guest.firstName.toLowerCase().includes(lowerQuery) ||
      guest.lastName.toLowerCase().includes(lowerQuery) ||
      guest.roomId.toString() === query
    );
  };

  const computedStats = stats || {
    totalRooms: rooms.length,
    occupiedRooms: rooms.filter(r => r.isOccupied).length,
    availableRooms: rooms.filter(r => !r.isOccupied).length,
    totalGuests: guests.length,
    occupancyRate: rooms.length > 0
      ? Math.round((rooms.filter(r => r.isOccupied).length / rooms.length) * 100)
      : 0,
  };

  return {
    rooms,
    guests,
    stats: computedStats,
    isLoading: roomsLoading || guestsLoading || statsLoading,
    error: roomsError || guestsError,
    getAvailableRooms,
    getOccupiedRooms,
    getRoomById,
    getGuestByRoomId,
    checkIn,
    checkOut,
    searchGuest,
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
  };
};
