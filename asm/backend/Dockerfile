# Use the official Node.js image
FROM node:20-alpine

# Set the working directory
RUN mkdir /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Command to run the application
CMD ["node", "server.js"]