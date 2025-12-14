import { useState } from 'react';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { RoomsView } from '@/components/RoomsView';
import { BookingForm } from '@/components/BookingForm';
import { GuestsView } from '@/components/GuestsView';
import { useHotelManagement } from '@/hooks/useHotelManagement';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [preselectedRoomId, setPreselectedRoomId] = useState<number | undefined>();
  
  const {
    rooms,
    guests,
    stats,
    getAvailableRooms,
    getRoomById,
    getGuestByRoomId,
    checkIn,
    checkOut,
  } = useHotelManagement();

  const handleBookRoom = (roomId: number) => {
    setPreselectedRoomId(roomId);
    setActiveTab('booking');
  };

  const handleCheckOut = (roomId: number) => {
    return checkOut(roomId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            rooms={rooms}
            guests={guests}
            stats={stats}
            onCheckOut={handleCheckOut}
            getGuestByRoomId={getGuestByRoomId}
          />
        );
      case 'rooms':
        return (
          <RoomsView
            rooms={rooms}
            getGuestByRoomId={getGuestByRoomId}
            onCheckOut={handleCheckOut}
            onBook={handleBookRoom}
          />
        );
      case 'booking':
        return (
          <BookingForm
            rooms={rooms}
            getAvailableRooms={getAvailableRooms}
            onCheckIn={checkIn}
            preselectedRoomId={preselectedRoomId}
          />
        );
      case 'guests':
        return (
          <GuestsView
            guests={guests}
            rooms={rooms}
            getRoomById={getRoomById}
            onCheckOut={handleCheckOut}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <Header activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        if (tab !== 'booking') setPreselectedRoomId(undefined);
      }} />
      
      <main className="relative pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {renderContent()}
        </div>
      </main>

      <Toaster />
    </div>
  );
};

export default Index;
