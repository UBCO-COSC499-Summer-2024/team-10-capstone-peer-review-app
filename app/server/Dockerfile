FROM node:22-slim

# Set the working directory
WORKDIR /usr/server/

# Copy the application source code & other project files to the working directory
# Note: This ignores the folders and files specified in the .dockerignore file.
COPY . /usr/server/

# Install app dependencies
RUN npm install

# TODO prisma migrate deploy

# Use an environment variable for the port
ARG PORT
ENV PORT=$BACKEND_PORT

EXPOSE $PORT

# CHANGE TO CMD ["npm", "start"] for production
# Start the application with nodemon for develpoment 
CMD ["npm", "run", "dev"]