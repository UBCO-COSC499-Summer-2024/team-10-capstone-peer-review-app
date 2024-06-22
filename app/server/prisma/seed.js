// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create specific users
  const users = [
    {
      email: 'student@gmail.com',
      password: 'Student@123',
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: 'STUDENT',
    },
    {
      email: 'instructor@gmail.com',
      password: 'Instructor@123',
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: 'INSTRUCTOR',
    },
    {
      email: 'admin@gmail.com',
      password: 'Admin@123',
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      role: 'ADMIN',
    },
  ];

  const createdUsers = await Promise.all(
    users.map(user => prisma.user.create({ data: user }))
  );

  // Create additional users
  const additionalUsers = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: faker.internet.password(),
          firstname: faker.name.firstName(),
          lastname: faker.name.lastName(),
          role: 'STUDENT',
        },
      })
    )
  );

  const allUsers = [...createdUsers, ...additionalUsers];

  // Create classes
  const classes = await Promise.all(
    Array.from({ length: 5 }).map((_, index) =>
      prisma.class.create({
        data: {
          classname: faker.lorem.words(3),
          description: faker.lorem.sentence(),
          startDate: faker.date.past(),
          endDate: faker.date.future(),
          instructor: {
            connect: {
              userId: allUsers[index % 3 === 0 ? 1 : 2].userId, // Assign to instructor or admin
            },
          },
        },
      })
    )
  );

  // Enroll students in classes
  await Promise.all(
    allUsers.filter(user => user.role === 'STUDENT').map(student =>
      prisma.userInClass.create({
        data: {
          userId: student.userId,
          classId: classes[faker.datatype.number({ min: 0, max: 4 })].classId,
        },
      })
    )
  );

  // Create assignments
  const assignments = await Promise.all(
    classes.map(classItem =>
      prisma.assignment.create({
        data: {
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          dueDate: faker.date.future(),
          classId: classItem.classId,
        },
      })
    )
  );

  // Create submissions
  await Promise.all(
    allUsers.filter(user => user.role === 'STUDENT').map(student =>
      prisma.submission.create({
        data: {
          assignmentId: assignments[faker.datatype.number({ min: 0, max: 4 })].assignmentId,
          submitterId: student.userId,
          sumbissionFilePath: faker.system.filePath(),
          finalGrade: faker.datatype.number({ min: 50, max: 100 }),
        },
      })
    )
  );

  // Create reviews
  await Promise.all(
    allUsers.filter(user => user.role === 'STUDENT').map(student =>
      prisma.review.create({
        data: {
          submissionId: assignments[faker.datatype.number({ min: 0, max: 4 })].assignmentId,
          reviewerId: student.userId,
          revieweeId: allUsers[faker.datatype.number({ min: 0, max: 2 })].userId, // Review another user
          reviewGrade: faker.datatype.number({ min: 1, max: 10 }),
        },
      })
    )
  );
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
