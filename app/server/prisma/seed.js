import prisma from "./prismaClient.js";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

// Dynamically set up environment variables based on NODE_ENV
import { setupEnv } from "../src/utils/envConfig.js";
setupEnv();

async function main() {
	// Clean up existing data
	await prisma.review.deleteMany();
	await prisma.submission.deleteMany();
	await prisma.userInClass.deleteMany();
	await prisma.assignment.deleteMany();
	await prisma.category.deleteMany();
	await prisma.group.deleteMany();
	await prisma.class.deleteMany();
	await prisma.user.deleteMany();

	const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);

	// Adding resuable functions
	async function hashedPassword(password) {
		return await bcrypt.hash(password, SALT_ROUNDS);
	}

	// Create students

	const student = await prisma.user.create({
		data: {
			email: "student@gmail.com",
			password: await hashedPassword("Student@123"),
			firstname: faker.person.firstName(),
			lastname: faker.person.lastName(),
			isEmailVerified: true,
			isRoleActivated: true,
			role: "STUDENT"
		}
	});
	
	const student1 = await prisma.user.create({
		data: {
			email: "student1@gmail.com",
			password: await hashedPassword("Student@123"),
			firstname: faker.person.firstName(),
			lastname: faker.person.lastName(),
			isEmailVerified: true,
			isRoleActivated: true,
			role: "STUDENT"
		}
	});
	
	const student2 = await prisma.user.create({
		data: {
			email: "student2@gmail.com",
			password: await hashedPassword("Student@123"),
			firstname: faker.person.firstName(),
			lastname: faker.person.lastName(),
			isEmailVerified: true,
			isRoleActivated: true,
			role: "STUDENT"
		}
	});
	
	const student3 = await prisma.user.create({
		data: {
			email: "student3@gmail.com",
			password: await hashedPassword("Student@123"),
			firstname: faker.person.firstName(),
			lastname: faker.person.lastName(),
			isEmailVerified: true,
			isRoleActivated: true,
			role: "STUDENT"
		}
	});
	
	const student4 = await prisma.user.create({
		data: {
			email: "student4@gmail.com",
			password: await hashedPassword("Student@123"),
			firstname: faker.person.firstName(),
			lastname: faker.person.lastName(),
			isEmailVerified: true,
			isRoleActivated: true,
			role: "STUDENT"
		}
	});

	// Create instructors & admin
	const instructor = await prisma.user.create({
		data: {
			email: "instructor@gmail.com",
			password: await hashedPassword("Instructor@123"),
			firstname: faker.person.firstName(),
			lastname: faker.person.lastName(),
			role: "INSTRUCTOR",
			isEmailVerified: true,
			isRoleActivated: true
		}
	});

	const admin = await prisma.user.create({
		data: {
			email: "admin@gmail.com",
			password: await hashedPassword("Admin@123"),
			firstname: faker.person.firstName(),
			lastname: faker.person.lastName(),
			role: "ADMIN",
			isEmailVerified: true,
			isRoleActivated: true
		}
	});

	// Create classes and link them to users
	const class1 = await prisma.class.create({
		data: {
			classname: faker.person.firstName() + " Class",
			description: "This is a test class",
			startDate: new Date(),
			endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
			instructorId: instructor.userId,
			classSize: 5
		}
	});

	const class2 = await prisma.class.create({
		data: {
			classname: faker.person.firstName() + " Class",
			description: "This is another test class",
			startDate: new Date(),
			endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
			instructorId: admin.userId,
			classSize: 5
		}
	});

	const class3 = await prisma.class.create({
		data: {
			classname: faker.person.firstName() + " Advanced Class",
			description: "This is an advanced test class",
			startDate: new Date(),
			endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
			instructorId: instructor.userId,
			classSize: 5
		}
	});

	const class4 = await prisma.class.create({
		data: {
			classname: faker.person.firstName() + " Basic Class",
			description: "This is a basic test class",
			startDate: new Date(),
			endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
			instructorId: admin.userId,
			classSize: 5
		}
	});

	// Enroll the student in classes
	await prisma.userInClass.create({
		data: {
			userId: student.userId,
			classId: class1.classId
		}
	});

	await prisma.userInClass.create({
		data: {
			userId: student.userId,
			classId: class2.classId
		}
	});

	await prisma.userInClass.create({
		data: {
			userId: student.userId,
			classId: class3.classId
		}
	});

	await prisma.userInClass.create({
		data: {
			userId: student.userId,
			classId: class4.classId
		}
	});

	// Enroll student1 in classes
	await prisma.userInClass.create({
		data: {
			userId: student1.userId,
			classId: class1.classId
		}
	});

	await prisma.userInClass.create({
		data: {
			userId: student1.userId,
			classId: class2.classId
		}
	});

	// Enroll student2 in classes
	await prisma.userInClass.create({
		data: {
			userId: student2.userId,
			classId: class3.classId
		}
	});

	await prisma.userInClass.create({
		data: {
			userId: student2.userId,
			classId: class4.classId
		}
	});

	// Create categories
	const category1 = await prisma.category.create({
		data: {
			classId: class1.classId,
			name: "Homework"
		}
	});

	const category2 = await prisma.category.create({
		data: {
			classId: class2.classId,
			name: "Quizzes"
		}
	});

	const category3 = await prisma.category.create({
		data: {
			classId: class3.classId,
			name: "Exams"
		}
	});

	const category4 = await prisma.category.create({
		data: {
			classId: class4.classId,
			name: "Projects"
		}
	});


	// Create rubrics
const rubric1 = await prisma.rubric.create({
	data: {
	  title: "Basic Rubric",
	  description: "A basic rubric for general assignments",
	  totalMarks: 100,
	  creatorId: instructor.userId,
	  classId: class1.classId,
	}
  });
  
  const rubric2 = await prisma.rubric.create({
	data: {
	  title: "Advanced Rubric",
	  description: "An advanced rubric for complex assignments",
	  totalMarks: 100,
	  creatorId: instructor.userId,
	  classId: class2.classId,
	}
  });
  
  const rubric3 = await prisma.rubric.create({
	data: {
	  title: "Exam Rubric",
	  description: "A rubric for exams",
	  totalMarks: 100,
	  creatorId: instructor.userId,
	  classId: class3.classId,
	}
  });
  
  const rubric4 = await prisma.rubric.create({
	data: {
	  title: "Project Rubric",
	  description: "A rubric for projects",
	  totalMarks: 100,
	  creatorId: instructor.userId,
	  classId: class4.classId,
	}
  });
  
	// Create assignments and link them to categories

	// TODO - Refactor by adding a URL to the assignment file path
	// Create assignments and link them to categories and classes
// Create assignments and link them to categories, classes, and rubrics
const assignment1 = await prisma.assignment.create({
    data: {
        title: faker.person.firstName() + " Assignment",
        description: "This is a test assignment",
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        assignmentFilePath:
            "https://raw.githubusercontent.com/py-pdf/sample-files/8c405ece5eff12396a34a1fae3276132002e1753/004-pdflatex-4-pages/pdflatex-4-pages.pdf", // dummy file
        category: {
            connect: { categoryId: category1.categoryId }
        },
        classes: {
            connect: { classId: class1.classId }
        },
        rubric: {
            connect: { rubricId: rubric1.rubricId }
        }
    }
});

const assignment2 = await prisma.assignment.create({
    data: {
        title: faker.person.firstName() + " Assignment",
        description: "This is another test assignment",
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        assignmentFilePath:
            "https://raw.githubusercontent.com/py-pdf/sample-files/8c405ece5eff12396a34a1fae3276132002e1753/004-pdflatex-4-pages/pdflatex-4-pages.pdf", // dummy file
        category: {
            connect: { categoryId: category2.categoryId }
        },
        classes: {
            connect: { classId: class2.classId }
        },
        rubric: {
            connect: { rubricId: rubric2.rubricId }
        }
    }
});

const assignment3 = await prisma.assignment.create({
    data: {
        title: faker.person.firstName() + " Exam",
        description: "This is a test exam",
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
        assignmentFilePath:
            "https://raw.githubusercontent.com/py-pdf/sample-files/8c405ece5eff12396a34a1fae3276132002e1753/004-pdflatex-4-pages/pdflatex-4-pages.pdf", // dummy file
        category: {
            connect: { categoryId: category3.categoryId }
        },
        classes: {
            connect: { classId: class3.classId }
        },
        rubric: {
            connect: { rubricId: rubric3.rubricId }
        }
    }
});

const assignment4 = await prisma.assignment.create({
    data: {
        title: faker.person.firstName() + " Project",
        description: "This is a test project",
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        assignmentFilePath:
            "https://raw.githubusercontent.com/py-pdf/sample-files/8c405ece5eff12396a34a1fae3276132002e1753/004-pdflatex-4-pages/pdflatex-4-pages.pdf", // dummy file
        category: {
            connect: { categoryId: category4.categoryId }
        },
        classes: {
            connect: { classId: class4.classId }
        },
        rubric: {
            connect: { rubricId: rubric4.rubricId }
        }
    }
});

	// Create groups
	const group1 = await prisma.group.create({
		data: {
			classId: class1.classId,
			groupName: faker.lorem.word() + " Group",
			groupDescription: faker.lorem.sentence(),
			groupSize: 5,
		}
	});

	const group2 = await prisma.group.create({
		data: {
			classId: class2.classId,
			groupName: faker.lorem.word() + " Group",
			groupDescription: faker.lorem.sentence(),
			groupSize: 5,
		}
	});

	const group3 = await prisma.group.create({
		data: {
			classId: class3.classId,
			groupName: faker.lorem.word() + " Group",
			groupDescription: faker.lorem.sentence(),
			groupSize: 5,
		}
	});

	const group4 = await prisma.group.create({
		data: {
			classId: class4.classId,
			groupName: faker.lorem.word() + " Group",
			groupDescription: faker.lorem.sentence(),
			groupSize: 5,
		}
	});

	console.log("Database has been seeded. 🌱");
}



main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
