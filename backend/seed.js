const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const User = require('./models/userModel');
const Patient = require('./models/patientModel');
const Appointment = require('./models/appointmentModel');
const Treatment = require('./models/treatmentModel');

const connectDB = require('./connect/database');

const seedDatabase = async () => {
    try {
        await connectDB();
        
        // Clear existing data
        await Patient.deleteMany({});
        await Appointment.deleteMany({});
        await Treatment.deleteMany({});

        // Get or create a test user
        let user = await User.findOne({ email: 'clinic@example.com' });
        if (!user) {
            const bcryptjs = require('bcryptjs');
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash('password123', salt);
            
            user = await User.create({
                name: 'Clinic Admin',
                email: 'clinic@example.com',
                password: hashedPassword
            });
            console.log('Created test user:', user.email);
        }

        // Sample patients
        const patientsData = [
            {
                fullName: 'John Smith',
                phone: '555-0101',
                email: 'john.smith@example.com',
                age: 35,
                gender: 'Male',
                address: '123 Main St, Springfield',
                user: user._id
            },
            {
                fullName: 'Sarah Johnson',
                phone: '555-0102',
                email: 'sarah.j@example.com',
                age: 28,
                gender: 'Female',
                address: '456 Oak Ave, Springfield',
                user: user._id
            },
            {
                fullName: 'Michael Brown',
                phone: '555-0103',
                email: 'mbrown@example.com',
                age: 45,
                gender: 'Male',
                address: '789 Elm St, Springfield',
                user: user._id
            },
            {
                fullName: 'Emily Davis',
                phone: '555-0104',
                email: 'emily.d@example.com',
                age: 32,
                gender: 'Female',
                address: '321 Pine Rd, Springfield',
                user: user._id
            },
            {
                fullName: 'Robert Wilson',
                phone: '555-0105',
                email: 'robert.w@example.com',
                age: 52,
                gender: 'Male',
                address: '654 Maple Dr, Springfield',
                user: user._id
            }
        ];

        const patients = await Patient.insertMany(patientsData);
        console.log(`Created ${patients.length} patients`);

        // Sample appointments
        const appointmentsData = [
            {
                patient: patients[0]._id,
                appointmentDate: new Date(2026, 5, 10, 10, 0),
                appointmentTime: '10:00 AM',
                dentistName: 'Dr. James Mitchell',
                treatmentType: 'Dental Cleaning',
                status: 'Scheduled',
                user: user._id
            },
            {
                patient: patients[1]._id,
                appointmentDate: new Date(2026, 5, 11, 14, 30),
                appointmentTime: '2:30 PM',
                dentistName: 'Dr. Sarah Anderson',
                treatmentType: 'Filling',
                status: 'Scheduled',
                user: user._id
            },
            {
                patient: patients[2]._id,
                appointmentDate: new Date(2026, 5, 5, 9, 0),
                appointmentTime: '9:00 AM',
                dentistName: 'Dr. James Mitchell',
                treatmentType: 'Root Canal',
                status: 'Completed',
                user: user._id
            },
            {
                patient: patients[3]._id,
                appointmentDate: new Date(2026, 5, 12, 11, 0),
                appointmentTime: '11:00 AM',
                dentistName: 'Dr. Sarah Anderson',
                treatmentType: 'Whitening',
                status: 'Scheduled',
                user: user._id
            },
            {
                patient: patients[4]._id,
                appointmentDate: new Date(2026, 5, 8, 3, 0),
                appointmentTime: '3:00 PM',
                dentistName: 'Dr. James Mitchell',
                treatmentType: 'Crown Placement',
                status: 'Completed',
                user: user._id
            }
        ];

        const appointments = await Appointment.insertMany(appointmentsData);
        console.log(`Created ${appointments.length} appointments`);

        // Sample treatments
        const treatmentsData = [
            {
                patient: patients[0]._id,
                treatmentName: 'Routine Cleaning',
                treatmentType: 'Dental Cleaning',
                cost: 100,
                treatmentDate: new Date(2026, 4, 28),
                notes: 'Standard cleaning, plaque removal',
                user: user._id
            },
            {
                patient: patients[1]._id,
                treatmentName: 'Composite Filling',
                treatmentType: 'Filling',
                cost: 150,
                treatmentDate: new Date(2026, 4, 25),
                notes: 'Tooth #14, upper right',
                user: user._id
            },
            {
                patient: patients[2]._id,
                treatmentName: 'Root Canal Treatment',
                treatmentType: 'Root Canal',
                cost: 800,
                treatmentDate: new Date(2026, 4, 20),
                notes: 'Infected root, full RCT completed',
                user: user._id
            },
            {
                patient: patients[3]._id,
                treatmentName: 'Teeth Whitening',
                treatmentType: 'Whitening',
                cost: 200,
                treatmentDate: new Date(2026, 4, 15),
                notes: 'Professional whitening treatment',
                user: user._id
            },
            {
                patient: patients[4]._id,
                treatmentName: 'Crown Placement',
                treatmentType: 'Crown Placement',
                cost: 1200,
                treatmentDate: new Date(2026, 4, 10),
                notes: 'Porcelain crown on tooth #8',
                user: user._id
            }
        ];

        const treatments = await Treatment.insertMany(treatmentsData);
        console.log(`Created ${treatments.length} treatments`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
