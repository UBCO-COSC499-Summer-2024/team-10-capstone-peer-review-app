The actual source files of a software project are usually stored inside the src folder. Alternatively, you can put them into the lib (if you're developing a library), or into the app folder (if your application's source files are not supposed to be compiled).

Installation: 

## Docker deployment
Navigate to this directory (stay here if you're already here) and run in terminal:

- docker-compose up (-d if you want to run detatched)
    - make sure to include .env file in the root of /app i.e. /app/.env

## .env file Setup: 
These are the associated .env file locations 
- frontend env var = /app/client/PeerGrade/.env
- backend env var = /app/client/PeerGrade/.env
- docker env var = /app/.env 

For values of env vars and new changes check the .env channel in discord
If you add any new changes / new env vars @everyone in the discord with 
the new files or changes and what they are used for 

## Server Setup:
navigate to app/server then run in terminal:

- npm i
- npm run dev 

#### For Setting up Prisma Local Development: 
Run the commands (depending on Workflow): 
- 1st: npx prisma generate 
    - this generates the Prisma client -> the communication between postgreSQL and Prisma ORM
- 2nd: npx prisma db push 
    - syncs changes to schema tables to the database 
    - run everytime changes happen on schema.prisma 


## Client Setup: 
navigate to app/client/PeerGrade then run in terminal 

- npm i
- npm run dev 

