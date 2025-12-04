# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build argument for API URL
ARG VITE_API_URL=http://localhost:3001/api
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S nginx_custom && \
    adduser -S nginx_custom -u 1001 && \
    chown -R nginx_custom:nginx_custom /usr/share/nginx/html && \
    chown -R nginx_custom:nginx_custom /var/cache/nginx && \
    chown -R nginx_custom:nginx_custom /var/log/nginx && \
    chown -R nginx_custom:nginx_custom /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx_custom:nginx_custom /var/run/nginx.pid

# Switch to non-root user
USER nginx_custom

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
