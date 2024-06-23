import prisma from './prismaClient';
import bcrypt from 'bcrypt'; 
import { faker } from '@faker-js/faker' 

// Dynamically set up environment variables based on NODE_ENV
import "../src/utils/envConfig.js";

async function main() {
  // Clean up existing data
  await prisma.review.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.userInClass.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();

  const SALT_ROUNDS = process.env.SALT_ROUNDS;

  // Adding resuable functions  
  async function hashedPassword(password) { 
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  // Create users
  const student = await prisma.user.create({
    data: {
      email: 'student@gmail.com',
      password: hashedPassword('Student@123'),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      role: 'STUDENT',
    },
  });

  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@gmail.com',
      password: hashedPassword('Instructor@123'),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      role: 'INSTRUCTOR',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: hashedPassword('Admin@123'),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      role: 'ADMIN',
    },
  });

  // Create classes and link them to users
  const class1 = await prisma.class.create({
    data: {
      classname: faker.person.firstName() + ' Class',
      description: 'This is a test class',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      instructorId: instructor.userId,
    },
  });

  const class2 = await prisma.class.create({
    data: {
      classname: faker.person.firstName() + ' Class',
      description: 'This is another test class',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      instructorId: admin.userId,
    },
  });

  // Enroll the student in both classes
  await prisma.userInClass.create({
    data: {
      userId: student.userId,
      classId: class1.classId,
    },
  });

  await prisma.userInClass.create({
    data: {
      userId: student.userId,
      classId: class2.classId,
    },
  });

  // Create assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      title: faker.person.firstName() + ' Assignment',
      description: 'This is a test assignment',
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      classId: class1.classId,
    },
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      title: faker.person.firstName() + ' Assignment',
      description: 'This is another test assignment',
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      classId: class2.classId,
    },
  });

  // Create submissions
  const submission1 = await prisma.submission.create({
    data: {
      assignmentId: assignment1.assignmentId,
      submitterId: student.userId,
      sumbissionFilePath: faker.internet.url(),
      finalGrade: null,
    },
  });

  const submission2 = await prisma.submission.create({
    data: {
      assignmentId: assignment2.assignmentId,
      submitterId: student.userId,
      sumbissionFilePath: faker.internet.url(),
      finalGrade: null,
    },
  });

  // Create reviews
  await prisma.review.create({
    data: {
      submissionId: submission1.submissionId,
      reviewerId: instructor.userId,
      revieweeId: student.userId,
      reviewGrade: 90,
    },
  });

  await prisma.review.create({
    data: {
      submissionId: submission2.submissionId,
      reviewerId: admin.userId,
      revieweeId: student.userId,
      reviewGrade: 95,
    },
  });

  console.log('Database has been seeded. 🌱');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
