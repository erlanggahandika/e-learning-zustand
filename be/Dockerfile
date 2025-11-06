# FROM node:20-alpine
FROM mirror.gcr.io/library/node:20-alpine


WORKDIR /app

# Install build dependencies for node-gyp
RUN apk add --no-cache python3 make g++

# Copy dependency files dulu (buat caching layer)
COPY package*.json ./

# Install dependencies (termasuk devDependencies)
RUN npm install

# Copy seluruh source code
COPY . .

# Pastikan Prisma punya akses ke .env
COPY .env ./

# Generate Prisma client saat build
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Jalankan nodemon saat container start (dev mode)
CMD ["npm", "run", "dev"]

