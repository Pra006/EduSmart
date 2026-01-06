// index.js
import 'dotenv/config.js';
import express from 'express';
import { db } from './db/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


import UserRoute from './routes/UserRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import courseRoute from './routes/courseRoute.js';
import enrollRoute from './routes/enrollRoute.js';
import adminRoute from './routes/adminRoute.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created');
}

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.CLIENT_URL || 'http://localhost:5173'
    ],
    credentials: true,
}));

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Middlewares
app.use(cookieParser());
app.use(express.json({limit: "100mb"}));
app.use(express.urlencoded({limit: "100mb", extended: true }));

// Routes
app.use('/api/user', UserRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/course', courseRoute);
app.use('/api/enroll', enrollRoute);
app.use('/api/admin', adminRoute);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'Server is running',
        database: 'Connected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Backend API is running',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            user: '/api/user'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);

    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        success: false,
        status,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack
        })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
        method: req.method,
        availableEndpoints: {
            user: '/api/user',
            health: '/api/health'
        }
    });
});

// Connect DB & start server
db().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🚀 ===============================`);
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`📊 Database connected`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`\n📍 Endpoints:`);
        console.log(`   👤 User API: http://localhost:${PORT}/api/user`);
        console.log(`   🏥 Health: http://localhost:${PORT}/api/health`);
        console.log(`===============================\n`);
    });
}).catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n⚠️ Server shutting down...');
    process.exit(0);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    process.exit(1);
});
