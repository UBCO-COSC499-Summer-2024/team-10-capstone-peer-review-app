import prisma from "../../prisma/prismaClient.js";

const shutdown = async (signal, server) => { 
    console.log(`Received ${signal}. Shutting down server...`);

    try {
        await prisma.$disconnect();
        console.log("Prisma connection closed");

        server.close(() => {
            console.log('Server closed.');
            process.exit(0);
          });
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
}

export default shutdown;