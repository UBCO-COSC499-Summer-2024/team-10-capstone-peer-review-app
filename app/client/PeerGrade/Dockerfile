FROM node:22-slim

ARG FRONTEND_PORT

ENV CI=true

# Set the working directory
WORKDIR /usr/client/

# Copy the application source code & other project files to the working directory
# Note: This ignores the folders and files specified in the .dockerignore file.
COPY . /usr/client/

# Install app dependencies
RUN npm install

# Use an environment variable for the port

EXPOSE ${FRONTEND_PORT}

# Start the application
CMD ["npm", "run", "dev"]