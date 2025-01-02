FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose port 80
EXPOSE 80

# Start the application
CMD ["node", "app.js"] 