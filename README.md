# Hotel Management System - Grand Luxe

A full-stack hotel management system built with React, TypeScript, Node.js, and SQLite. Manage room bookings, guest check-ins/check-outs, and generate invoices with automatic GST calculation.

## 🚀 Features

- **Dashboard**: Real-time statistics and occupancy overview
- **Room Management**: View and manage 15 rooms across 3 categories (Standard, Deluxe, Premium Suite)
- **Guest Management**: Track active guests and their bookings
- **Booking System**: Easy check-in with room selection and guest information
- **Billing**: Automatic invoice generation with 12% GST calculation
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **shadcn/ui** components
- **Tailwind CSS** for styling
- **React Query** for data fetching and state management
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **SQLite** database
- **RESTful API** architecture

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hoteloberoi
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

   Create a `.env` file in the `server` directory (optional):
   ```env
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8080
   ```

## 🏃 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:3000`

2. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:8080`

### Production Mode

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the backend in production mode**
   ```bash
   cd server
   npm run prod
   ```

3. **Serve the frontend (optional)**
   ```bash
   npm run start
   ```

## 📁 Project Structure

```
hoteloberoi/
├── src/                    # Frontend React application
│   ├── components/        # React components
│   │   ├── Dashboard.tsx
│   │   ├── BookingForm.tsx
│   │   ├── RoomsView.tsx
│   │   ├── GuestsView.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   │   └── useHotelManagement.ts
│   ├── lib/               # Utilities and API client
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── pages/             # Page components
│   ├── types/              # TypeScript type definitions
│   └── App.tsx            # Main app component
├── server/                 # Backend Express API
│   ├── index.js           # API routes and server setup
│   ├── database.js        # SQLite database setup
│   └── hotel.db           # SQLite database (auto-created)
└── public/                # Static assets
```

## 🗄️ Database Schema

### Rooms Table
- `id` (INTEGER PRIMARY KEY)
- `type` (TEXT: 'non-ac', 'ac', 'premium')
- `price` (INTEGER)
- `isOccupied` (INTEGER: 0 or 1)

### Guests Table
- `id` (TEXT PRIMARY KEY)
- `firstName` (TEXT)
- `lastName` (TEXT)
- `contact` (TEXT)
- `email` (TEXT)
- `roomId` (INTEGER, FOREIGN KEY)
- `checkInDate` (TEXT)
- `numberOfDays` (INTEGER)
- `totalBill` (INTEGER)
- `status` (TEXT: 'active' or 'checked-out')

## 🔌 API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/rooms` - Get all rooms
- `GET /api/guests` - Get all active guests
- `GET /api/stats` - Get hotel statistics
- `POST /api/bookings` - Create a new booking (check-in)
- `POST /api/checkout/:roomId` - Check out a guest

## 🎨 Room Configuration

- **Standard (Non-AC)**: Rooms 1-5, ₹2,000/night
- **Deluxe (AC)**: Rooms 6-10, ₹2,500/night
- **Premium Suite**: Rooms 11-15, ₹3,000/night

GST Rate: 12%

## 🧪 Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🚢 Deployment

### Frontend Deployment

The frontend can be deployed to any static hosting service:
- **Vercel**: Connect your repository and deploy
- **Netlify**: Drag and drop the `dist` folder after building
- **AWS S3 + CloudFront**: Upload the `dist` folder to S3

Remember to set the `VITE_API_URL` environment variable to your backend URL.

### Backend Deployment

The backend can be deployed to:
- **Heroku**: Add a `Procfile` with `web: node index.js`
- **Railway**: Connect your repository
- **DigitalOcean App Platform**: Configure Node.js app
- **AWS EC2**: Set up Node.js environment

Make sure to:
1. Set `NODE_ENV=production`
2. Set `PORT` environment variable
3. Set `FRONTEND_URL` for CORS configuration
4. Ensure SQLite database file is persisted (or migrate to PostgreSQL for production)

## 🔒 Production Considerations

1. **Database**: Consider migrating from SQLite to PostgreSQL or MySQL for production
2. **Authentication**: Add user authentication and authorization
3. **Rate Limiting**: Implement API rate limiting
4. **Logging**: Add comprehensive logging (Winston, Pino)
5. **Monitoring**: Set up error tracking (Sentry)
6. **Backup**: Implement database backup strategy
7. **HTTPS**: Use HTTPS in production
8. **Environment Variables**: Never commit `.env` files

## 🐛 Troubleshooting

### Database not initializing
- Check that SQLite is installed
- Ensure write permissions in the `server` directory
- Delete `server/hotel.db` and restart the server

### CORS errors
- Verify `VITE_API_URL` matches your backend URL
- Check server CORS configuration in `server/index.js`

### Port already in use
- Change the port in `.env` or `server/index.js`
- Kill the process using the port: `lsof -ti:3000 | xargs kill`

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and Node.js
