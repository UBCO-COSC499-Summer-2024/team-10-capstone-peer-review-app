import express from "express"; 

const instructorsRouter = (prisma) => { 
    const router = express.Router();

    //working
    router.get("/", async (req, res) => {
        try {
            const users = await prisma.user.findMany({ where: { role: "INSTRUCTOR" }});
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Failed to retrieve users " + error});
        }
    });

    //working
    router.get("/my-classes", async (req, res) => {
        // Get the user ID from the Passport user object
        // const instructorId = req.user.userId;
        const instructorId = "bd6e6f46-672a-4314-a4d9-8e673b2a4026"; // for Postman purposes only

        try {
            // Retrieve all classes for the instructor
            const classes = await prisma.class.findMany({
                where: {
                    instructorId: instructorId
                }
            });

            res.status(200).json(classes);
        } catch (error) {
            res.status(500).json({ message: "Failed to retrieve classes: " + error });
        }
    });

    // working
    router.delete("/delete-class/:className", async (req, res) => {
        const { className } = req.params;
        try {
            const classToDelete = await prisma.class.findFirst({
                where: {
                  classname: className
                }
            });
              
            if (classToDelete) {
            await prisma.class.delete({
                where: {
                classId: classToDelete.classId
                }
            });
            res.status(200).json({ message: 'Class deleted: ' + classToDelete.classname });
            } else {
            res.status(404).json({ message: 'Class not found' });
            }
        } catch (error) {
            res.status(500).json({ message: "Failed to delete class: " + error });
        }
    });

    
    // working

    // router.post("/fi", async (req, res) => {
    //     const { username } = req.body;
    //     try {
    //         const user = await prisma.user.findMany({
    //             where: {
    //                 username: username,
    //                 role: "INSTRUCTOR"
    //             }
    //         });
            
    //         res.status(200).json(user);

    //     } catch (err) {
    //         res.status(500).json({ message: "Failed to retrieve instructor" + err});
    //     }
    // });


    // working
    router.post("/create-class", async (req, res) => { 
        // Assumes when a user logs in, JWT will include 
        //const instructorId = req.user.userId;
        //const { instructorId } = req.body; // for Postman purposes only

        const { instructorId, classname, description, startDate, endDate, term, classSize }  = req.body;

        // let sdObj = new Date(startDate.replace(/(\d+)(st|nd|rd|th)/, "$1"));
        // let edObj = new Date(endDate.replace(/(\d+)(st|nd|rd|th)/, "$1"));

        // // Format the Date object as a string in the SQL datetime format (YYYY-MM-DD HH:MM:SS)
        // let sdSQL = sdObj.toISOString().slice(0, 19).replace('T', ' ');
        // let edSQL = edObj.toISOString().slice(0, 19).replace('T', ' ');

        try {

            const newClass = await prisma.class.create({
                data: {
                    classname,
                    description,
                    startDate,
                    endDate,
                    term, 
                    classSize,
                    instructor: {
                        connect: {
                            userId: instructorId
                        }
                    }
                }
            });
            
            res.status(201).json({newClass});
        } catch (error) {
            res.status(500).json({ message: "Failed to create class" + error });
        }
    });

    
    router.put("/update-class/:classId", async (req, res) => {

        const { classId } = req.params;
        const { classname, description, startDate, endDate, term, classSize } = req.body;

        try {
            const updatedClass = await prisma.class.update({
                where: {
                    classId: classId
                },
                data: {
                    classname,
                    description,
                    startDate,
                    endDate,
                    term,
                    classSize
                }
            });

            res.status(200).json(updatedClass);
        } catch (error) {
            res.status(500).json({ message: "Failed to update class: " + error });
        }
    });


    router.post("/add-student/:classId", async (req, res) => {
        const { classId } = req.params;
        const { studentId } = req.body;

        try {
            const classToUpdate = await prisma.class.findUnique({
                where: {
                    classId: classId
                }
            });

            if (classToUpdate) {
                const updatedClass = await prisma.class.update({
                    where: {
                        classId: classId
                    },
                    data: {
                        usersInClass: {
                            create: {
                                userId: studentId
                            }
                        }
                    }
                });

                res.status(200).json(updatedClass);
            } else {
                res.status(404).json({ message: 'Class not found' });
            }
        } catch (error) {
            res.status(500).json({ message: "Failed to add student to class: " + error });
        }
    });


    // router.post("/user-id", async (req, res) => {
    //     const { userId } = req.body;
    //     try {
    //         res.status(200).json({ userId });
    //     } catch (error) {
    //         res.status(500).json({ message: "Failed to retrieve user ID" });
    //     }
    // });

    // Get classes taught by the instructor

    // add ensureInstructor middleware to api-endpoints 
    // return a single user by id
    // router.get("/:id",  async (req, res) => {
    //     const { id } = req.params;
    //     const user = await prisma.user.findUnique({
    //         where: {
    //             userId: id,
    //         },
    //     });
    //     res.json(user);
    // });

    // working
    // keep this one at the very bottom
    router.get("/:un", async (req, res) => {
        const { un } = req.params;
        try {
            const user = await prisma.user.findUnique({
                where: {
                    username: un,
                    role: "INSTRUCTOR"
                }
            });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ message: "Failed to retrieve user " + err });
        }
        
    });

    return router; 

}

export default instructorsRouter 