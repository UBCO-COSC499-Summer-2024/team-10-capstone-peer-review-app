import prisma from "./prismaClient.js";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

// Dynamically set up environment variables based on NODE_ENV
import { setupEnv } from "../src/utils/envConfig.js";
setupEnv();

async function main() {
	// Clean up existing data
	await prisma.criterionGrade.deleteMany();
	await prisma.criterionRating.deleteMany();
	await prisma.criterion.deleteMany();
	await prisma.review.deleteMany();
	await prisma.submission.deleteMany();
	await prisma.extendedDueDate.deleteMany();
	await prisma.comment.deleteMany();
	await prisma.commentChain.deleteMany();
	await prisma.assignment.deleteMany();
	await prisma.category.deleteMany();
	await prisma.rubric.deleteMany();
	await prisma.todo.deleteMany();
	await prisma.enrollRequest.deleteMany();
	await prisma.userInClass.deleteMany();
	await prisma.group.deleteMany();
	await prisma.class.deleteMany();
	await prisma.notification.deleteMany();
	await prisma.roleRequest.deleteMany();
	await prisma.report.deleteMany();
	await prisma.user.deleteMany();

	const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);

	// Adding reusable functions
	async function hashedPassword(password) {
		return await bcrypt.hash(password, SALT_ROUNDS);
	}

	// Set the assignment due date to 2 days from now at 11:59 PM
	const assignmentDueDate = new Date();
	assignmentDueDate.setDate(assignmentDueDate.getDate() + 2);
	assignmentDueDate.setHours(23, 59, 0, 0);

	// Create admin user
	await prisma.user.create({
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

	// Create instructor user
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

	// Create student users
	const students = await Promise.all([
		prisma.user.create({
			data: {
				email: "student@gmail.com",
				password: await hashedPassword("Student@123"),
				firstname: faker.person.firstName(),
				lastname: faker.person.lastName(),
				isEmailVerified: true,
				isRoleActivated: true,
				role: "STUDENT"
			}
		}),
		...Array(3)
			.fill()
			.map(async (_, index) =>
				prisma.user.create({
					data: {
						email: `student${index + 1}@gmail.com`,
						password: await hashedPassword("Student@123"),
						firstname: faker.person.firstName(),
						lastname: faker.person.lastName(),
						isEmailVerified: true,
						isRoleActivated: true,
						role: "STUDENT"
					}
				})
			)
	]);

	// Create classes
	const classes = await Promise.all(
		Array(3)
			.fill()
			.map(() =>
				prisma.class.create({
					data: {
						classname: `${faker.animal.dog()} Class`,
						description: faker.lorem.paragraph(),
						startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
						endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
						instructorId: instructor.userId,
						classSize: 5
					}
				})
			)
	);

	// Enroll students in classes
	await Promise.all(
		classes.flatMap((class_) =>
			students.map((student) =>
				prisma.userInClass.create({
					data: {
						userId: student.userId,
						classId: class_.classId
					}
				})
			)
		)
	);

	// Create categories, assignments, rubrics, and groups for each class
	for (const class_ of classes) {
		const category = await prisma.category.create({
			data: {
				classId: class_.classId,
				name: `Category for ${class_.classname}`
			}
		});

		const assignmentTitle = faker.animal.bird() + " Assignment";
		const rubric = await prisma.rubric.create({
			data: {
				creatorId: instructor.userId,
				classId: class_.classId,
				title: `Rubric for "${assignmentTitle}"`,
				description: `Rubric for the assignment: ${assignmentTitle}`,
				totalMarks: 90
			}
		});

		// Create criteria and criterion ratings
		const criteria = await Promise.all(
			Array(3)
				.fill()
				.map((_, index) =>
					prisma.criterion.create({
						data: {
							rubricId: rubric.rubricId,
							title: `Criterion ${index + 1}`,
							maxMark: 30,
							minMark: 0,
							criterionRatings: {
								create: [
									{ description: "Poor", points: 10 },
									{ description: "Average", points: 20 },
									{ description: "Excellent", points: 30 }
								]
							}
						}
					})
				)
		);

		const assignment = await prisma.assignment.create({
			data: {
				classId: class_.classId,
				rubricId: rubric.rubricId,
				title: assignmentTitle,
				description: faker.lorem.paragraph(),
				dueDate: assignmentDueDate,
				assignmentFilePath:
					"https://raw.githubusercontent.com/py-pdf/sample-files/8c405ece5eff12396a34a1fae3276132002e1753/004-pdflatex-4-pages/pdflatex-4-pages.pdf",
				allowedFileTypes: ["pdf"],
				categoryId: category.categoryId
			}
		});

		await prisma.group.create({
			data: {
				classId: class_.classId,
				groupName: `Group for ${class_.classname}`,
				groupDescription: `This is the group for ${class_.classname}`,
				groupSize: 5
			}
		});

		// Create submissions for all students except student@gmail.com
		for (const student of students.slice(1)) {
			await prisma.submission.create({
				data: {
					assignmentId: assignment.assignmentId,
					submitterId: student.userId,
					submissionFilePath:
						"https://raw.githubusercontent.com/py-pdf/sample-files/8c405ece5eff12396a34a1fae3276132002e1753/004-pdflatex-4-pages/pdflatex-4-pages.pdf"
				}
			});
		}
	}
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
