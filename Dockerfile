# Use the official Node.js image from Docker Hub as the base image
FROM node:20-alpine

# Install bash (if needed)
RUN apk add --no-cache bash

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code and migration script
COPY . .

# Expose the port your app will run on (default NestJS port is 3000)
EXPOSE 3000

# Run migrations and then start the app
CMD sleep 15 && npm run migration:run && npm run start:dev
