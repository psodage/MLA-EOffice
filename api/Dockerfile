# Use official Node.js 20 LTS Alpine image
FROM node:20-alpine AS base

# Install curl for container health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source code
COPY src/ ./src/
COPY .sequelizerc ./

# Create logs directory
RUN mkdir -p logs && chown -R node:node /app

# Use non-root user for enhanced security
USER node

# Expose API port
EXPOSE 5000

# Define container health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/v1/health || exit 1

# Start Node.js Express server
CMD ["node", "src/server.js"]
