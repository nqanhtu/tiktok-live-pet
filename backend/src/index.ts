import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { MetricsStore } from './metricsStore';
import { TikTokService } from './tiktokService';
import { ConnectPayload } from './types';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const store = new MetricsStore();
const tiktokService = new TikTokService(store);

// Relay service events to socket clients
tiktokService.on('event:chat', (chatItem) => {
  io.emit('event:chat', chatItem);
});

tiktokService.on('event:gift', (giftItem) => {
  io.emit('event:gift', giftItem);
});

tiktokService.on('event:social', (socialItem) => {
  io.emit('event:social', socialItem);
});

tiktokService.on('event:pet_evolve', (evolutionEvent) => {
  io.emit('event:pet_evolve', evolutionEvent);
});

tiktokService.on('stream:status', (status, error) => {
  io.emit('stream:status', { status, error });
  io.emit('metrics:snapshot', store.getSnapshot());
});

// Periodic snapshot broadcast every 1000ms
setInterval(() => {
  io.emit('metrics:snapshot', store.getSnapshot());
}, 1000);

// REST API Endpoints
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});

app.get('/api/snapshot', (_req, res) => {
  res.json(store.getSnapshot());
});

app.post('/api/connect', async (req, res) => {
  const payload = req.body as ConnectPayload;
  if (!payload || !payload.uniqueId) {
    res.status(400).json({ error: 'uniqueId is required' });
    return;
  }

  try {
    await tiktokService.connect(payload);
    io.emit('metrics:snapshot', store.getSnapshot());
    res.json({ success: true, snapshot: store.getSnapshot() });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to connect to TikTok LIVE' });
  }
});

app.post('/api/simulate', (req, res) => {
  const { uniqueId } = req.body || {};
  tiktokService.startSimulation(uniqueId);
  io.emit('metrics:snapshot', store.getSnapshot());
  res.json({ success: true, snapshot: store.getSnapshot() });
});

app.post('/api/disconnect', (_req, res) => {
  tiktokService.disconnect();
  io.emit('metrics:snapshot', store.getSnapshot());
  res.json({ success: true, snapshot: store.getSnapshot() });
});

// Helper for pet interactions
function handlePetInteract(payload: {
  action: 'spawn' | 'chat' | 'like' | 'gift';
  uniqueId?: string;
  nickname?: string;
  comment?: string;
  likeCount?: number;
  diamondCount?: number;
  giftName?: string;
}) {
  const uid = payload.uniqueId || 'tester_vip';
  const name = payload.nickname || 'Tester Bạn Thân';

  if (payload.action === 'spawn') {
    store.addSocial({
      type: 'join',
      uniqueId: uid,
      nickname: name,
    });
  } else if (payload.action === 'chat') {
    store.addChat({
      uniqueId: uid,
      nickname: name,
      comment: payload.comment || 'Bé cưng ăn ngon mau lớn nha! 🐾✨',
    });
  } else if (payload.action === 'like') {
    store.addLikes(payload.likeCount || 10, undefined, {
      uniqueId: uid,
      nickname: name,
    });
  } else if (payload.action === 'gift') {
    const diamonds = payload.diamondCount || 30;
    const gName = payload.giftName || 'Doughnut';
    store.addGift({
      uniqueId: uid,
      nickname: name,
      giftId: 9999,
      giftName: gName,
      diamondCount: diamonds,
      repeatCount: 1,
      repeatEnd: true,
      giftType: 0,
    });
  }
}

app.post('/api/pet/interact', (req, res) => {
  const payload = req.body || {};
  handlePetInteract(payload);
  io.emit('metrics:snapshot', store.getSnapshot());
  res.json({ success: true, snapshot: store.getSnapshot() });
});

app.post('/api/reset', (_req, res) => {
  tiktokService.disconnect();
  store.reset();
  io.emit('metrics:snapshot', store.getSnapshot());
  res.json({ success: true, snapshot: store.getSnapshot() });
});

// Socket.IO event handling
io.on('connection', (socket) => {
  // Immediately send the latest snapshot upon connection
  socket.emit('metrics:snapshot', store.getSnapshot());

  socket.on('stream:connect', async (payload: ConnectPayload) => {
    try {
      await tiktokService.connect(payload);
      io.emit('metrics:snapshot', store.getSnapshot());
    } catch (err: any) {
      socket.emit('stream:error', { message: err?.message || 'Failed to connect' });
    }
  });

  socket.on('stream:simulate', (payload?: { uniqueId?: string }) => {
    tiktokService.startSimulation(payload?.uniqueId);
    io.emit('metrics:snapshot', store.getSnapshot());
  });

  socket.on('stream:disconnect', () => {
    tiktokService.disconnect();
    io.emit('metrics:snapshot', store.getSnapshot());
  });

  socket.on('pet:interact', (payload?: any) => {
    handlePetInteract(payload || {});
    io.emit('metrics:snapshot', store.getSnapshot());
  });

  socket.on('stream:reset', () => {
    tiktokService.disconnect();
    store.reset();
    io.emit('metrics:snapshot', store.getSnapshot());
  });
});

// Serve static frontend in production if built
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`TikTok LIVE Analytics Backend running on port ${PORT}`);
});
