import express from "express"; 

const instructorsRouter = (prisma) => { 
    const router = express.Router();

    // const instructorId = req.user.userId; // check for abstraction

    //working
    router.get("/", async (req, res) => {
        try {
            console.log(req.user); // added for debugging purpose
            const users = await prisma.user.findMany({ where: { role: "INSTRUCTOR" }});
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Failed to retrieve users " + error});
        }
    });

    //working
    router.get("/my-classes", async (req, res) => {
        // Get the user ID from the Passport user object
        // const instructorId = req.user.userId; //uncomment this for production
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

    // working with ID
    router.delete("/delete-class/:classID", async (req, res) => {
        const { classID } = req.params;
        try {
            const classToDelete = await prisma.class.findUnique({
                where: {
                  classId: classID
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


    // working for creating multiple classes for the same instructor iff insructorId in Class table is NOT UNIQUE.
    router.post("/create-class", async (req, res) => { 
        // Assumes when a user logs in, JWT will include 
        //const instructorId = req.user.userId; //uncomment this for production

        const { instructorId, classname, description, startDate, endDate, term, classSize }  = req.body;

        // it will be assumed that the startDate and endDate is in the SQL date time format

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

    //working
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


    //working for adding multiple students in multiple classes
    // !! ADD MORE CHECKS AFTER DISCUSSION
    router.post("/add-student/:classId", async (req, res) => {
        const { classId } = req.params;
        const { studentId } = req.body;
        
        try {
            // Check if the user is a student
            const student = await prisma.user.findUnique({
                where: {
                    userId: studentId,
                    role: "STUDENT"
                }
            });


            const updatingClass = await prisma.class.findUnique({
                where: {
                    classId: classId
                }
            });
            // Check if the student already exists in the class
            const existingStudent = await prisma.class.findUnique({
                where: {
                    classId: classId
                },
                include: {
                    usersInClass: {
                        where: {
                            userId: studentId
                        }
                    }
                }
            });
            // console.log(existingStudent);
            // console.log(updatingClass.classSize);
            // console.log(updatingClass.usersInClass);

            let classSizeBool = true;
            if (updatingClass.usersInClass) {
                if (updatingClass.usersInClass.length < updatingClass.classSize) {
                    classSizeBool = true;
                } else {            
                    classSizeBool = false;
                }
            } else {
                classSizeBool = true;
            }

            if (student && classSizeBool) {
                if (!existingStudent || (existingStudent && existingStudent.usersInClass.length === 0)) {
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
                } else {
                    res.status(400).json({ message: 'Student already exists in the class' });
                }
            } else {    
                res.status(404).json({ message: 'Student not found' });
            }
          
        } catch (error) {
            res.status(500).json({ message: "Failed to add student to class: " + error });
        }
    });

    //working
    router.get("/students/:classId", async (req, res) => {
        const { classId } = req.params;
        try {
            const classWithStudents = await prisma.class.findUnique({
                where: {
                    classId: classId
                },
                include: {
                    usersInClass: {
                        include: {
                        utudent: true // TYPO ERROR IN THE SCHEMA
                        }
                    }
                }
            });
            res.status(200).json(classWithStudents.usersInClass);
        } catch (error) {
            res.status(500).json({ message: "Failed to retrieve students in class: " + error });
        }
    });

    //working
    router.delete("/delete-student/:classId", async (req, res) => {
        const { classId } = req.params;
        const { studentId } = req.body;
        try {
            const classToUpdate = await prisma.class.findUnique({
                where: {
                    classId: classId
                },
                include: {
                    usersInClass: {
                        where: {
                            userId: studentId
                        }
                    }
                }
            });

            if (classToUpdate && classToUpdate.usersInClass.length > 0) {
                const updatedClass = await prisma.class.update({
                    where: {
                        classId: classId
                    },
                    data: {
                        usersInClass: {
                            delete: [{
                                userId_classId: {
                                    userId: studentId,
                                    classId: classId
                                }
                            }]
                        }
                    }
                });
                res.status(200).json(updatedClass);
            } else {
                res.status(404).json({ message: 'Class or student not found' });
            }
        } catch (error) {
            res.status(500).json({ message: "Failed to delete student from class: " + error });
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
    //


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