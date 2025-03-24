# Step 1: Build the Go binary
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install necessary dependencies
RUN apk add --no-cache git

# Copy Go mod and sum files, then download dependencies
COPY go.mod go.sum ./
RUN go mod tidy

# Copy the source code
COPY . .

# Build the Go application
RUN go build -o main .

# Step 2: Set up the final image
FROM alpine:latest

WORKDIR /root/

# Copy the built Go binary from the builder stage
COPY --from=builder /app/main .

# Copy the .env file
COPY .env /root/.env

# Expose the port the app will run on
EXPOSE 8080

# Start the application
CMD ["./main"]