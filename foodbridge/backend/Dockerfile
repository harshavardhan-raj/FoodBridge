# Stage 1: Build the React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /web-frontend
COPY foodbridge/web-frontend/package*.json ./
RUN npm install
COPY foodbridge/web-frontend/ ./
RUN npm run build

# Stage 2: Run the Backend Server
FROM node:18-alpine
WORKDIR /app
COPY foodbridge/backend/package*.json ./
RUN npm install --production
COPY foodbridge/backend/ ./

# Copy the compiled frontend build from Stage 1
COPY --from=frontend-builder /web-frontend/dist ./dist

EXPOSE 5000
CMD ["node", "server.js"]
