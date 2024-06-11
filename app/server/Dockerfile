FROM node:22-slim

# Set the working directory
WORKDIR /usr/server/

# Copy the application source code & other project files to the working directory
# Note: This ignores the folders and files specified in the .dockerignore file.
COPY . /usr/server/

# Install app dependencies
RUN npm install

# Use an environment variable for the port
ARG PORT
ENV PORT=$BACKEND_PORT

EXPOSE $PORT

# Start the application
CMD ["npm", "start"]