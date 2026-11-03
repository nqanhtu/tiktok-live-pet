import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { SessionManager, normalizeUniqueId } from './sessionManager';
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

// Central Multi-tenant Session Manager
const sessionManager = new SessionManager(io);

// REST API Endpoints
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    activeSessions: sessionManager.getActiveSessionsSummary(),
    timestamp: Date.now(),
  });
});

app.get('/api/snapshot', (req, res) => {
  const username = (req.query.username as string) || 'demo';
  const session = sessionManager.getSession(username);
  if (session) {
    res.json(session.store.getSnapshot());
  } else {
    res.json(sessionManager.getOrCreateSession(username).store.getSnapshot());
  }
});

app.post('/api/connect', async (req, res) => {
  const payload = req.body as ConnectPayload;
  if (!payload || !payload.uniqueId) {
    res.status(400).json({ error: 'uniqueId is required' });
    return;
  }

  try {
    const session = sessionManager.getOrCreateSession(payload.uniqueId);
    await session.service.connect(payload);
    res.json({ success: true, snapshot: session.store.getSnapshot() });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to connect to TikTok LIVE' });
  }
});

app.post('/api/simulate', (req, res) => {
  const { uniqueId } = req.body || {};
  const session = sessionManager.getOrCreateSession(uniqueId || 'demo');
  session.service.startSimulation(session.uniqueId);
  res.json({ success: true, snapshot: session.store.getSnapshot() });
});

app.post('/api/disconnect', (req, res) => {
  const { uniqueId } = req.body || {};
  const session = sessionManager.getSession(uniqueId || 'demo');
  if (session) {
    session.service.disconnect();
    res.json({ success: true, snapshot: session.store.getSnapshot() });
  } else {
    res.json({ success: true });
  }
});

app.post('/api/pet/interact', (req, res) => {
  const payload = req.body || {};
  const targetUsername = payload.streamUsername || payload.uniqueId || 'demo';
  sessionManager.handlePetInteract(targetUsername, payload);
  const session = sessionManager.getSession(targetUsername);
  res.json({ success: true, snapshot: session?.store.getSnapshot() });
});

app.post('/api/reset', (req, res) => {
  const { uniqueId } = req.body || {};
  const session = sessionManager.getSession(uniqueId || 'demo');
  if (session) {
    session.service.disconnect();
    session.store.reset();
    res.json({ success: true, snapshot: session.store.getSnapshot() });
  } else {
    res.json({ success: true });
  }
});

// Socket.IO Multi-Tenant Event Handling
io.on('connection', (socket) => {
  // If socket connected with a query param (e.g. io('/', { query: { username: 'huyga.official' } }))
  const handshakeUsername = socket.handshake.query?.username as string | undefined;
  if (handshakeUsername) {
    const session = sessionManager.joinSession(socket, handshakeUsername);
    if (session.store.getStatus() === 'IDLE') {
      const clean = normalizeUniqueId(handshakeUsername);
      if (clean === 'demo') {
        session.service.startSimulation('demo');
      } else {
        session.service.connect({ uniqueId: clean }).catch((err) => {
          socket.emit('stream:error', { message: err?.message || 'Failed to auto-connect' });
        });
      }
    }
  }

  // Explicit Join Stream Room
  socket.on('stream:join', async (payload?: { uniqueId?: string; autoConnect?: boolean }) => {
    const targetId = payload?.uniqueId || socket.data.uniqueId || 'demo';
    const session = sessionManager.joinSession(socket, targetId);

    if (payload?.autoConnect && session.store.getStatus() === 'IDLE') {
      const clean = normalizeUniqueId(targetId);
      if (clean === 'demo') {
        session.service.startSimulation('demo');
      } else {
        session.service.connect({ uniqueId: clean }).catch((err) => {
          socket.emit('stream:error', { message: err?.message || 'Failed to auto-connect' });
        });
      }
    }
  });

  // Connect to live stream
  socket.on('stream:connect', async (payload: ConnectPayload) => {
    if (!payload?.uniqueId) return;
    try {
      const session = sessionManager.joinSession(socket, payload.uniqueId);
      await session.service.connect(payload);
    } catch (err: any) {
      socket.emit('stream:error', { message: err?.message || 'Failed to connect' });
    }
  });

  // Start demo simulation
  socket.on('stream:simulate', (payload?: { uniqueId?: string }) => {
    const targetId = payload?.uniqueId || socket.data.uniqueId || 'demo';
    const session = sessionManager.joinSession(socket, targetId);
    session.service.startSimulation(session.uniqueId);
  });

  // Disconnect from stream
  socket.on('stream:disconnect', (payload?: { uniqueId?: string }) => {
    const targetId = payload?.uniqueId || socket.data.uniqueId;
    const session = sessionManager.getSession(targetId);
    if (session) {
      session.service.disconnect();
    }
  });

  // Pet interactive actions
  socket.on('pet:interact', (payload?: any) => {
    const targetId = payload?.streamUsername || socket.data.uniqueId || 'demo';
    sessionManager.handlePetInteract(targetId, payload || {});
  });

  // Reset session
  socket.on('stream:reset', (payload?: { uniqueId?: string }) => {
    const targetId = payload?.uniqueId || socket.data.uniqueId;
    const session = sessionManager.getSession(targetId);
    if (session) {
      session.service.disconnect();
      session.store.reset();
    }
  });

  // Cleanup on client disconnect
  socket.on('disconnect', () => {
    sessionManager.leaveSession(socket);
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
  console.log(`TikTok LIVE Analytics Multi-Tenant Backend running on port ${PORT}`);
});
