FROM node:22

# Copy package.json & app source files to /usr/app directory
# COPY app/package*.json /usr/app/
# COPY app/src /usr/app/

# Set the working directory to /usr/app/
WORKDIR /usr/app/

# Install app dependencies
# RUN npm install

# Start the application
# CMD ["node", "test.js"]