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
import notificationRoute from './routes/notificationRoute.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// ✅ Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created');
}

// ✅ CORS Configuration
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174', // Add if using different port
        process.env.CLIENT_URL || 'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
}));

// ✅ CRITICAL: Serve static video files with proper headers
app.use('/uploads', express.static(uploadsDir, {
    setHeaders: (res, filePath) => {
        // Enable video streaming
        res.set('Accept-Ranges', 'bytes');
        res.set('Access-Control-Allow-Origin', '*');
        
        // Set correct content type based on file extension
        if (filePath.endsWith('.mp4')) {
            res.set('Content-Type', 'video/mp4');
        } else if (filePath.endsWith('.webm')) {
            res.set('Content-Type', 'video/webm');
        } else if (filePath.endsWith('.ogg')) {
            res.set('Content-Type', 'video/ogg');
        }
        
        console.log(`📹 Serving video: ${path.basename(filePath)}`);
    }
}));

// ✅ Body parser with large limits for video metadata
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// ✅ Routes
app.use('/api/user', UserRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/course', courseRoute);
app.use('/api/enrollment', enrollRoute);
app.use('/api/admin', adminRoute);
app.use('/api', notificationRoute);

// Health Check with enhanced debugging
app.get('/api/health', (req, res) => {
    const uploadFiles = fs.existsSync(uploadsDir) 
        ? fs.readdirSync(uploadsDir).length 
        : 0;

    res.json({
        success: true,
        status: 'Server is running',
        database: 'Connected',
        uploadsDirectory: uploadsDir,
        uploadedFiles: uploadFiles,
        staticFilesServing: `http://localhost:${PORT}/uploads`,
        timestamp: new Date().toISOString(),
    });
});

// Test video endpoint
app.get('/api/test-video', (req, res) => {
    const files = fs.existsSync(uploadsDir) 
        ? fs.readdirSync(uploadsDir).filter(f => f.endsWith('.mp4'))
        : [];
    
    res.json({
        success: true,
        message: 'Video test endpoint',
        uploadsPath: uploadsDir,
        videoFiles: files,
        testUrls: files.map(f => `http://localhost:${PORT}/uploads/${f}`)
    });
});

app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Backend API is running',
        endpoints: {
            health: '/api/health',
            testVideo: '/api/test-video',
            uploads: '/uploads'
        }
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((req, res) => {
    console.log(`⚠️ 404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ 
        success: false, 
        message: 'Route not found',
        requestedUrl: req.url 
    });
});

// Connect DB & start server
db().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`\n🚀 ===============================`);
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`📂 Uploads Directory: ${uploadsDir}`);
        console.log(`📹 Static Files: http://localhost:${PORT}/uploads`);
        console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
        console.log(`🎬 Test Videos: http://localhost:${PORT}/api/test-video`);
        console.log(`===============================\n`);
    });

    // Increase timeout for large video uploads
    server.timeout = 600000; // 10 minutes

}).catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n⚠️ Server shutting down gracefully...');
    process.exit(0);
});