# Stage 1: Build the Angular Client (SSR)
FROM node:20-alpine as client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# Stage 2: Build the Node Server
FROM node:20-alpine as server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build

# Stage 3: Runtime Environment
FROM node:20-alpine
WORKDIR /app

# Install production dependencies for server
COPY server/package*.json ./
RUN npm ci --only=production

# Copy built server files
COPY --from=server-builder /app/server/dist ./dist
# Copy built client files (Browser & Server)
COPY --from=client-builder /app/client/dist ./client-dist

# Create uploads directory
RUN mkdir -p uploads

# Expose port (Backend runs on 3000)
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start command
# We need to run the compiled server code.
# The server code expects 'client/dist' to be relative or configured.
# We might need to adjust index.ts to look for client files in the right place if paths are hardcoded.
# For this demo, assuming server/src/index.ts uses path.join level up... let's verify.
# If server structure is /app/dist/index.js, and it looks for ../client/dist, we need:
# /app/client-dist -> /app/../client/dist logic?
# Let's adjust directory layout in container to match local dev as much as possible to avoid code changes.

# Layout:
# /app/server (where we run node)
# /app/client/dist (where static files are)

# Let's restructure Stage 3:
WORKDIR /app
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/package*.json ./server/
COPY --from=client-builder /app/client/dist ./client/dist

WORKDIR /app/server
RUN npm ci --only=production

# DB File needs to be persisted. In prod, mount a volume to /app/server/
# For now, just run.

CMD ["node", "dist/index.js"]
