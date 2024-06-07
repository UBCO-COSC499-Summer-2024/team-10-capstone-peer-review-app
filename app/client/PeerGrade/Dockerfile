FROM node:22-slim

ENV CI=true
ENV PORT=3000

# Set the working directory
WORKDIR /usr/client/

# Copy the application source code & other project files to the working directory
# Note: This ignores the folders and files specified in the .dockerignore file.
COPY . /usr/client/

# Install app dependencies
RUN npm install

EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]