require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use('/api/v1/webhooks', require('./routes/webhook.routes'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);

app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/user.routes'));
app.use('/api/v1/courses', require('./routes/course.routes'));
app.use('/api/v1/lessons', require('./routes/lesson.routes'));
app.use('/api/v1/categories', require('./routes/category.routes'));
app.use('/api/v1/quizzes', require('./routes/quiz.routes'));
app.use('/api/v1/assignments', require('./routes/assignment.routes'));
app.use('/api/v1/certificates', require('./routes/certificate.routes'));
app.use('/api/v1/blogs', require('./routes/blog.routes'));
app.use('/api/v1/reviews', require('./routes/review.routes'));
app.use('/api/v1/comments', require('./routes/comment.routes'));
app.use('/api/v1/notifications', require('./routes/notification.routes'));
app.use('/api/v1/payments', require('./routes/payment.routes'));
app.use('/api/v1/live-classes', require('./routes/liveClass.routes'));
app.use('/api/v1/progress', require('./routes/progress.routes'));
app.use('/api/v1/search', require('./routes/search.routes'));
app.use('/api/v1/dashboard', require('./routes/dashboard.routes'));
app.use('/api/v1/email', require('./routes/emailVerification.routes'));
app.use('/api/v1/settings', require('./routes/settings.routes'));
app.use('/api/v1/upload', require('./routes/upload.routes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
