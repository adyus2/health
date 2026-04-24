const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const healthRoutes = require('./routes/health');
const dietRoutes = require('./routes/diet');
const statsRoutes = require('./routes/stats');
const { closePool } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// 请求日志
app.use(morgan('[:date[iso]] :method :url :status :res[content-length] - :response-time ms'));

// CORS 配置（小程序端无 origin，全部放行）
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 限制请求体大小
app.use(express.json({ limit: '100kb' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/stats', statsRoutes);

// 健康检查
app.get('/api/ping', (req, res) => {
  res.json({ code: 0, msg: 'pong' });
});

// 全局错误兜底
app.use((err, req, res, _next) => {
  console.error('[Server] 未捕获错误:', err.message);
  res.status(500).json({ code: -1, msg: '服务器内部错误' });
});

const server = app.listen(PORT, () => {
  console.log(`[HealthApp] Server running on http://localhost:${PORT}`);
});

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n[HealthApp] 正在关闭...');
  server.close();
  await closePool();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  server.close();
  await closePool();
  process.exit(0);
});
