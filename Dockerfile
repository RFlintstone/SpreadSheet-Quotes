# Dockerfile
# Use the official Node.js image as the base image
FROM node:18-alpine
LABEL authors="Ruben Flinterman"

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Copy the views and public directory to the dist directory
RUN cp -r src/views dist/views
RUN cp -r src/public dist/public

# Expose the application port
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]