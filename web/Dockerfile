# Stage 1: Build React Application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Accept build arguments for environment variables
ARG VITE_API_BASE_URL=http://localhost:5000/api/v1
ARG VITE_APP_NAME="MLA E-Office"
ARG VITE_DEFAULT_LOCALE=mr

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_DEFAULT_LOCALE=${VITE_DEFAULT_LOCALE}

# Build static production assets into /app/dist
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Define container health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Run Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
