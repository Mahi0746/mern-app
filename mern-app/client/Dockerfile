# ==== Stage 1: build the React/TypeScript app ====
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the source code
COPY . .

# Build the app
RUN npm run build  # or yarn build

# ==== Stage 2: serve the built app with nginx ====
FROM nginx:stable-alpine AS production

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]