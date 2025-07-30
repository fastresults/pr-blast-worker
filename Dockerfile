FROM oven/bun:1.0

WORKDIR /app

# Copy package files
COPY package.json ./
COPY bun.lockb* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start the application (run TypeScript directly)
CMD ["bun", "run", "src/server.ts"]