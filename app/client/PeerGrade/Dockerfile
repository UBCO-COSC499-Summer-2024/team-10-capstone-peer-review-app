FROM node:22-slim

ARG FRONTEND_PORT

ENV CI=true

# Set the working directory
WORKDIR /usr/client/

# Copy the application source code & other project files to the working directory
# Note: This ignores the folders and files specified in the .dockerignore file.

# COPY . /usr/client/

COPY package.json /usr/client//package.json
COPY package-lock.json /usr/client/package-lock.json

RUN npm ci 

# Use an environment variable for the port

EXPOSE ${FRONTEND_PORT}

# Start the application
CMD ["npm", "run", "dev"]