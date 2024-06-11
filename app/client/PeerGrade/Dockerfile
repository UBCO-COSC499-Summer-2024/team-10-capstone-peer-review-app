FROM node:22-slim

ENV CI=true

# Set the working directory
WORKDIR /usr/client/

# Copy the application source code & other project files to the working directory
# Note: This ignores the folders and files specified in the .dockerignore file.
COPY . /usr/client/

# Install app dependencies
RUN npm install

# Use an environment variable for the port
ARG PORT
ENV PORT=$FRONTEND_PORT

EXPOSE $PORT

# Start the application
CMD ["npm", "run", "dev"]