# Dental Clinic Management System

A complete MERN Stack (MongoDB, Express, React, Node.js) application for managing a dental clinic's operations.

## Features

### Dashboard
- Real-time statistics (Total Patients, Appointments, Today's Appointments, Completed Treatments, Revenue)
- Monthly appointment and treatment charts
- Quick action buttons for adding new records

### Patient Management
- **Create**: Add new patients with full details
- **Read**: View all patients with search and filter capabilities
- **Update**: Edit patient information
- **Delete**: Remove patient records (with confirmation)
- **View Details**: See complete patient history including appointments and treatments

### Appointment Management
- **Create**: Schedule appointments with dentist assignment
- **Read**: View all appointments with status tracking
- **Update**: Modify appointment details
- **Delete**: Cancel appointments
- **Filter**: By status (Scheduled, Completed, Cancelled, No Show) and date
- **Search**: Sorted by date

### Treatment Management
- **Create**: Record treatments with cost and notes
- **Read**: View all treatments with revenue tracking
- **Update**: Edit treatment information
- **Delete**: Remove treatment records
- **Filter**: By treatment type
- **Statistics**: Total cost calculations

### Authentication
- User registration with email validation
- Secure JWT-based login
- Protected routes (redirect unauthenticated users)
- Logout functionality

### Navigation
- Responsive sidebar with quick navigation
- Mobile-friendly hamburger menu
- User profile display
- Easy logout

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching and caching
- **React Router 7** - Client-side routing
- **Vite** - Build tool
- **React Toastify** - Notifications
- **CSS3** - Styling

## Database Schema

### Users
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Patients
```javascript
{
  fullName: String,
  phone: String,
  email: String,
  age: Number,
  gender: String,
  address: String,
  registrationDate: Date,
  user: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointments
```javascript
{
  patient: ObjectId (reference to Patient),
  appointmentDate: Date,
  appointmentTime: String,
  dentistName: String,
  treatmentType: String,
  status: String (Scheduled, Completed, Cancelled, No Show),
  user: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

### Treatments
```javascript
{
  patient: ObjectId (reference to Patient),
  treatmentName: String,
  treatmentType: String,
  cost: Number,
  treatmentDate: Date,
  notes: String,
  user: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Account (Atlas or local instance)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd kajdro
```

#### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Configuration

#### Backend Setup (.env)
Create or update `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=7000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
JWT_SECRET=your_secret_key_here
```

#### Frontend Setup
The frontend is already configured in `vite.config.js` to proxy API requests to `http://localhost:7000`.

## Running the Application

### 1. Start MongoDB
Ensure MongoDB is running (either locally or via MongoDB Atlas connection string in .env)

### 2. Seed Demo Data (Optional)
```bash
cd backend
npm run seed
```

This will:
- Create a test user (clinic@example.com / password123)
- Add 5 sample patients
- Create 5 sample appointments
- Record 5 sample treatments

### 3. Start Backend Server
```bash
cd backend
npm run dev
```

Server will run on `http://localhost:7000`

### 4. Start Frontend Development Server
Open a new terminal:
```bash
cd frontend
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Usage

### First Time Setup
1. Start both backend and frontend servers
2. Click "Register" to create a new account
3. Or use the seeded test account: `clinic@example.com` / `password123`
4. Log in and you'll be directed to the Dashboard
5. Use the sidebar to navigate between sections

### Creating Records
- Use quick action buttons on dashboard
- Or use sidebar "Quick Add" section
- Fill in the required fields
- Click submit

### Viewing Records
- Click on any main menu item (Patients, Appointments, Treatments)
- Use search and filter options
- Click on patient names to view detailed history

### Editing Records
- Click the "Edit" button on any record
- Modify fields as needed
- Submit changes

### Deleting Records
- Click the "Delete" button
- Confirm deletion in the popup
- Record will be removed immediately

## Styling

The application uses a modern design with:
- Gradient backgrounds for dashboard cards
- Responsive grid layouts
- Smooth transitions and hover effects
- Mobile-first approach
- Professional color scheme (#667eea primary, #764ba2 secondary)

### Key CSS Files
- `dashboard.css` - Dashboard statistics and charts
- `list.css` - Tables and list views with search/filter
- `form.css` - Form inputs and validation
- `details.css` - Detailed patient information view
- `sidebar.css` - Navigation sidebar
- `app.css` - Layout wrapper styles

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Frontend route protection with Redux state
- **User Authorization**: Backend ensures users can only access their own data
- **Input Validation**: Both frontend and backend validation

## Responsive Design

The application is fully responsive:
- **Desktop**: Sidebar navigation visible, full layout
- **Tablet**: Hamburger menu, optimized grid
- **Mobile**: Full-screen navigation, stacked layouts

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Treatments
- `GET /api/treatments` - Get all treatments
- `GET /api/treatments/:id` - Get treatment by ID
- `POST /api/treatments` - Create treatment
- `PUT /api/treatments/:id` - Update treatment
- `DELETE /api/treatments/:id` - Delete treatment

All endpoints (except register/login) require JWT authentication via `Authorization: Bearer <token>` header.

## Testing the Application

### Test User Account
- Email: `clinic@example.com`
- Password: `password123`
- Created automatically when running `npm run seed`

### Test Data Includes
- 5 Sample Patients with various details
- 5 Appointments with different statuses
- 5 Treatments with costs

## Dashboard Metrics

The dashboard displays:
- **Total Patients**: Count of all registered patients
- **Total Appointments**: Count of all scheduled appointments
- **Today's Appointments**: Appointments scheduled for today
- **Completed Today**: Treatments completed on the current day
- **Estimated Revenue**: Sum of all treatment costs

Charts show:
- Appointments by month (bar chart)
- Treatments by month (bar chart)

## Troubleshooting

### Backend won't start
- Ensure MongoDB connection string is correct in `.env`
- Check if port 7000 is available
- Verify all dependencies are installed: `npm install`

### Frontend won't connect to API
- Ensure backend is running on port 7000
- Check vite proxy settings in `vite.config.js`
- Clear browser cache and restart dev server

### Authentication issues
- Clear localStorage: `localStorage.clear()` in browser console
- Ensure JWT_SECRET matches between sessions
- Try logging out and logging back in

### No seed data appears
- Run `npm run seed` from backend directory
- Check MongoDB connection is working
- Verify MONGO_URI in .env is correct

## Build for Production

### Frontend Build
```bash
cd frontend
npm run build
```

Creates optimized build in `frontend/dist/`

### Backend Deployment
```bash
cd backend
npm run start
```

Set `NODE_ENV=production` in .env for production

## License

This project is created for educational purposes.

## Development Notes

### Code Structure
- Backend follows MVC pattern (Models, Controllers, Routes)
- Frontend uses Redux Toolkit for state management
- RTK Query handles API calls and caching
- Protected routes ensure authenticated access

### Key Features Implemented
- Complete CRUD operations for all resources
- Real-time data synchronization via RTK Query
- Form validation (frontend and backend)
- Error handling with toast notifications
- Responsive design for all screen sizes
- Search and filter functionality
- Data relationships and population

### Future Enhancements
- Doctor/dentist management
- Prescription management
- Billing system
- Appointment reminders (email/SMS)
- Advanced reporting
- Payment integration
- Backup and export features


**Last Updated**: June 2026
**Version**: 1.0.0
