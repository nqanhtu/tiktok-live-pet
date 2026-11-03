FROM node:20-alpine

WORKDIR /app

# Copy root, backend, and frontend package manifests
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies for root, backend, and frontend
RUN npm install && npm run install:all

# Copy source code
COPY backend ./backend
COPY frontend ./frontend

# Build frontend (Vite) and backend (TypeScript)
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["npm", "start"]
