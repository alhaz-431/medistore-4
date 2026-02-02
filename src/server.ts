import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. Home Route
app.get('/', (req, res) => {
  res.send('MediStore API is Running! 🚀');
});

// 2. Auth: Register
app.post('/api/auth/register', async (req: any, res: any) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: 'CUSTOMER' as any }
    });
    
    res.status(201).json({ message: "User created!", user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: "Registration failed or user already exists" });
  }
});

// 3. Auth: Login
app.post('/api/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: "Login successful", token, user: { name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// 4. Test DB Connection
app.get('/api/test-db', async (req, res) => {
  try {
    const count = await prisma.user.count();
    res.json({ success: true, totalUsers: count });
  } catch (error) {
    res.status(500).json({ success: false, error: "DB not connected" });
  }
});

// ৫. নতুন অর্ডার তৈরি করা
app.post('/api/orders', async (req: any, res: any) => {
  try {
    const { userId, totalAmount, shippingAddress } = req.body; 
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount, // স্কিমা অনুযায়ী নাম ঠিক করা হয়েছে
        shippingAddress, // স্কিমা অনুযায়ী এটি রিকোয়ার্ড
        status: 'PLACED' as any, // আপনার Enum এ PENDING নেই, PLACED আছে
      }
    });
    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to place order. Make sure userId, totalAmount and shippingAddress are provided." });
  }
});

// ৬. সব অর্ডার দেখা (অ্যাডমিনের জন্য)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        user: true,
        items: true // আপনার স্কিমার রিলেশন অনুযায়ী
      } 
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch orders" });
  }
});

// 7. Orders: Get All Orders (For Admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true } 
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch orders" });
  }
});

// Server Start
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

// Last Updated: Feb 2, 2026 - Sprint 1 Complete 🚀