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
	await prisma.category.deleteMany(); // Add this line
	await prisma.class.deleteMany();
	await prisma.user.deleteMany();

	const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);

	// Adding resuable functions
	async function hashedPassword(password) {
		return await bcrypt.hash(password, SALT_ROUNDS);
	}

	// Create users
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
			instructorId: instructor.userId
		}
	});

	const class2 = await prisma.class.create({
		data: {
			classname: faker.person.firstName() + " Class",
			description: "This is another test class",
			startDate: new Date(),
			endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
			instructorId: admin.userId
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
			instructorId: admin.userId
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

	// Create assignments and link them to categories

	// TODO - Refactor by adding a URL to the assignment file path
	const assignment1 = await prisma.assignment.create({
		data: {
			title: faker.person.firstName() + " Assignment",
			description: "This is a test assignment",
			dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
			classId: class1.classId,
			assignmentFilePath:
				"https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK", // dummy file
			categoryId: category1.categoryId // Link to category
		}
	});

	const assignment2 = await prisma.assignment.create({
		data: {
			title: faker.person.firstName() + " Assignment",
			description: "This is another test assignment",
			dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
			classId: class2.classId,
			assignmentFilePath:
				"https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK", // dummy file
			categoryId: category2.categoryId // Link to category
		}
	});

	const assignment3 = await prisma.assignment.create({
		data: {
			title: faker.person.firstName() + " Exam",
			description: "This is a test exam",
			dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
			classId: class3.classId,
			assignmentFilePath:
				"https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK", // dummy file
			categoryId: category3.categoryId // Link to category
		}
	});

	const assignment4 = await prisma.assignment.create({
		data: {
			title: faker.person.firstName() + " Project",
			description: "This is a test project",
			dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
			classId: class4.classId,
			assignmentFilePath:
				"https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK", // dummy file
			categoryId: category4.categoryId // Link to category
		}
	});

	// Create submissions
	const submission1 = await prisma.submission.create({
		data: {
			assignmentId: assignment1.assignmentId,
			submitterId: student.userId,
			submissionFilePath: faker.internet.url(),
			finalGrade: 92
		}
	});

	const submission2 = await prisma.submission.create({
		data: {
			assignmentId: assignment2.assignmentId,
			submitterId: student.userId,
			submissionFilePath: faker.internet.url(),
			finalGrade: 80
		}
	});

	const submission3 = await prisma.submission.create({
		data: {
			assignmentId: assignment3.assignmentId,
			submitterId: student.userId,
			submissionFilePath: faker.internet.url(),
			finalGrade: null
		}
	});

	const submission4 = await prisma.submission.create({
		data: {
			assignmentId: assignment4.assignmentId,
			submitterId: student.userId,
			submissionFilePath: faker.internet.url(),
			finalGrade: null
		}
	});

	// Create reviews
	await prisma.review.create({
		data: {
			submissionId: submission1.submissionId,
			reviewerId: instructor.userId,
			revieweeId: student.userId,
			reviewGrade: 90
		}
	});

	await prisma.review.create({
		data: {
			submissionId: submission2.submissionId,
			reviewerId: admin.userId,
			revieweeId: student.userId,
			reviewGrade: 95
		}
	});

	await prisma.review.create({
		data: {
			submissionId: submission3.submissionId,
			reviewerId: instructor.userId,
			revieweeId: student.userId,
			reviewGrade: 85
		}
	});

	await prisma.review.create({
		data: {
			submissionId: submission4.submissionId,
			reviewerId: admin.userId,
			revieweeId: student.userId,
			reviewGrade: 92
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
