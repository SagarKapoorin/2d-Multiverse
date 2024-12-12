# Stage 1: Builder
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Add build essentials and git for dependencies that may require compilation
RUN apk add --no-cache python3 make g++ git

# Copy package files for all monorepo subprojects
COPY pm2.config.js ./
COPY package*.json ./
COPY apps/Http/package*.json ./apps/Http/
COPY apps/webSockets/package*.json ./apps/webSockets/
COPY apps/Frontend/package*.json ./apps/Frontend/
COPY packages/db/package*.json ./packages/db/

# Install Turborepo globally and root dependencies
RUN npm install -g turbo serve && npm install --quiet

# Copy all source files
COPY . .

# Build all apps and packages
RUN turbo run build

# Stage 2: Production
FROM node:18-alpine AS production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Install additional runtime dependencies
RUN apk add --no-cache dumb-init curl bash && \
    npm install -g pm2 && \
    adduser -D nodejs

# Set working directory
WORKDIR /app

# Copy built files from the builder stage
RUN npm install -g turbo vite
COPY --from=builder /app/apps/Http/package*.json ./apps/Http/
COPY --from=builder /app/apps/webSockets/package*.json ./apps/webSockets/
COPY --from=builder /app/apps/Frontend/package*.json ./apps/Frontend/
COPY --from=builder /app/packages/db/package*.json ./packages/db/
COPY --from=builder /app/turbo.json ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/Http/dist ./apps/Http/dist
COPY --from=builder /app/apps/webSockets/dist ./apps/webSockets/dist
COPY --from=builder /app/apps/Frontend/dist ./apps/Frontend/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist

# Copy root package.json and .env
COPY --from=builder /app/package*.json ./ 
COPY --from=builder /app/.env.production .env

# Install only production dependencies
RUN npm ci --only=production --quiet && \
    npm cache clean --force

# Change ownership of the app directory



# Expose port
EXPOSE 3000

WORKDIR /app
# Use dumb-init as entrypoint
HEALTHCHECK CMD curl --fail http://localhost:3000/ || exit 1
CMD ["npm", "run", "dev"]
