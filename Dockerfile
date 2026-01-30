FROM node:16-alpine

# Install Yarn 1.22.22
RUN corepack disable && \
    npm install -g yarn@1.22.22

WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies (ignore engines for Node 16 compatibility)
RUN yarn install --ignore-engines

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["yarn", "start"]
