# Step 1: Build the React app
FROM node:20 AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the React source code
COPY . .

# Build the React app
RUN npm run build

# Step 2: Set up the final image
FROM nginx:alpine

# Copy the built React app to Nginx's public folder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy the Nginx configuration file
# Delete the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

