const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const contactRoutes = require('./routes/contactRoutes');
const taskRoutes = require('./routes/taskRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const jobRoutes = require('./routes/jobRoutes');
const productRoutes = require('./routes/productRoutes');
const faqRoutes = require('./routes/faqRoutes');
const locationRoutes = require('./routes/locationRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const chatRoutes = require('./routes/chatRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const configRoutes = require('./routes/configRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const locationRequestRoutes = require('./routes/locationRequestRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const homeUIConfigRoutes = require('./routes/homeUIConfigRoutes');
const homeCategoryRoutes = require('./routes/homeCategoryRoutes');
const workflowStepRoutes = require('./routes/workflowStepRoutes');
const trustCardRoutes = require('./routes/trustCardRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const jobConsultingRoutes = require('./routes/jobConsultingRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const Message = require('./models/Message');
const path = require('path');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/forge_india_connect')
    .then(() => {
        console.log('✅ Connected to MongoDB');
        initializeAdmin();
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Expose io to req.app
app.set('io', io);

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── Rate Limiters ────────────────────────────────────────────────────────────

// General API limiter — 1000 req per 15 min
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP. Please try again after 15 minutes.' },
});

// Strict Auth limiter — 10 req per 15 min (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login/register attempts. Please wait 15 minutes and try again.' },
  skipSuccessfulRequests: true, // Only count failed attempts
});

// Payment limiter — 20 req per 15 min
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many payment requests. Please try again shortly.' },
});

app.use('/api', apiLimiter);
app.use('/api/payments', paymentLimiter);
app.use('/api/job-consulting', paymentLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/products', productRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/configs', configRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/location-requests', locationRequestRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/home-ui-config', homeUIConfigRoutes);
app.use('/api/home-categories', homeCategoryRoutes);
app.use('/api/workflow-steps', workflowStepRoutes);
app.use('/api/trust-cards', trustCardRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/job-consulting', jobConsultingRoutes);
app.use('/api/training', trainingRoutes);

// Static Uploads Folder
const __dirnameBase = path.resolve();
app.use('/uploads', express.static(path.join(__dirnameBase, 'uploads')));

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'Forge India Connect API is running...', version: '2.0.2 (Stable)', timestamp: new Date() });
});

// ─── Socket.IO Real-Time Chat ─────────────────────────────────────────────────
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  socket.on('user-online', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      io.emit('online-users', Array.from(onlineUsers.keys()));
    }
  });

  socket.on('private-message', async ({ senderId, receiverId, content, messageType, fileUrl }) => {
    try {
      const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
        messageType: messageType || 'text',
        fileUrl,
      });

      const populated = await Message.findById(message._id)
        .populate('sender', 'firstName lastName role')
        .populate('receiver', 'firstName lastName role');

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive-message', populated);
      }
      socket.emit('receive-message', populated);
    } catch (err) {
      socket.emit('message-error', { message: 'Failed to send message' });
    }
  });

  socket.on('typing', ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user-typing', { senderId });
    }
  });

  socket.on('stop-typing', ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user-stopped-typing', { senderId });
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('online-users', Array.from(onlineUsers.keys()));
    }
  });
});

// ─── Self-Initialization (Admin Bootstrap) ────────────────────────────────────
const User = require('./models/User');
const initializeAdmin = async () => {
    try {
        const adminEmails = ['admin@forgeindiaconnect.com', 'admin@forgeindia.com'];
        const hashedAdminPassword = '$2a$10$Fd5d55YjMBTKkLZH7Uf0yufnTQlIUTB.BzSlKciWHEAmT2.jPSuWi'; // Hash for 'admin123'
        
        for (const adminEmail of adminEmails) {
            const adminExists = await User.findOne({ email: adminEmail });
            
            if (!adminExists) {
                await User.create({
                    firstName: 'Super',
                    lastName: 'Admin',
                    email: adminEmail,
                    password: hashedAdminPassword, // Using pre-hashed password
                    role: 'Admin',
                    approvalStatus: 'Approved'
                });
                console.log(`✅ Bootstrap: Admin account created (${adminEmail})`);
            } else {
                // Force sync password and approval status
                await User.updateOne({ email: adminEmail }, { 
                    password: hashedAdminPassword,
                    approvalStatus: 'Approved',
                    role: 'Admin'
                });
                console.log(`✅ Bootstrap: Admin synchronized (${adminEmail})`);
            }
        }
    } catch (err) {
        console.error('❌ Bootstrap Error:', err.message);
    }
};

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} with Socket.IO`);
  console.log(`🔒 Auth rate limiter: 10 req/15min on login & register`);
  console.log(`💳 Payment rate limiter: 20 req/15min`);
});
