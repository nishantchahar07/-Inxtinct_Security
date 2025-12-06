import mongoose from 'mongoose';
import { EmployeeModel } from '../types/mongooseModels';
import { MONGODB_URI } from '../config/env';

export async function connect() {
  const uri = MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set.');

  console.log('Connecting to MongoDB...');
  try {
    const conn = await mongoose.connect(uri, {
    
      serverSelectionTimeoutMS: 5000,
    } as any);
    if (conn.connections) {
      console.log('Connected to MongoDB');
    }
  } catch (err: any) {
    const reason = (err && err.message) ? err.message : 'Unknown error';
    console.error('Failed to connect to MongoDB:', reason);
    throw err;
  }

  await seedIfEmpty();
}

async function seedIfEmpty() {
  const count = await EmployeeModel.countDocuments();
  if (count > 0) return;
  await EmployeeModel.insertMany([
    { name: 'Alice Johnson', department: 'Engineering', city: 'San Francisco', salary: 145000, joinedAt: monthsAgo(2) },
    { name: 'Brian Lee', department: 'Engineering', city: 'New York', salary: 135000, joinedAt: monthsAgo(1) },
    { name: 'Carla Gomez', department: 'Marketing', city: 'Chicago', salary: 98000, joinedAt: monthsAgo(1) },
    { name: 'Daniel Wu', department: 'Sales', city: 'San Francisco', salary: 112000, joinedAt: monthsAgo(0) },
    { name: 'Eva Martin', department: 'HR', city: 'Austin', salary: 90000, joinedAt: monthsAgo(3) },
    { name: 'Frank Zhang', department: 'Engineering', city: 'Seattle', salary: 128000, joinedAt: monthsAgo(0) },
  ]);
}

function monthsAgo(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(Math.max(1, Math.min(d.getDate(), 25)));
  return d;
}
