FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set non-root user for security
RUN chown -R bun:bun /app
USER bun

# Expose application port
EXPOSE 3000/tcp

# Start command
CMD ["bun", "run", "src/index.ts"]
