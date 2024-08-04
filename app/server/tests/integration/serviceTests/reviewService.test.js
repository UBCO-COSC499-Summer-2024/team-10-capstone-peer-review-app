// import prisma from "../../../prisma/prismaClient";
// import reviewService from "../../../src/services/reviewService.js";
// import authService from "../../../src/services/authService.js";
// import apiError from "../../../src/utils/apiError";
// import e from "express";

// let user;
// beforeAll(async () => {
//     await prisma.$connect();
//     // const userData = {
//     //     email: "verified@example.com",
//     //     password: "password123",
//     //     firstname: "Verified",
//     //     lastname: "User",
//     //     role: "STUDENT"
//     // };

//     // await authService.registerUser(userData);
//     // await prisma.user.update({
//     //     where: { email: userData.email },
//     //     data: { isEmailVerified: true, isRoleActivated: true }
//     // });

//     // user = await authService.loginUser(
//     //     userData.email,
//     //     userData.password
//     // );
// });

// afterAll(async () => {
//     await prisma.$disconnect();
// });

// beforeEach(async () => {
//     await prisma.review.deleteMany();
// });

// describe("Review Service Integration Tests", () => {
//     describe("createReview", () => {
//         it("should create a new review", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId", // change ids to original ids
//                 reviewerId: "testReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: true
//             };

//             const review = await reviewService.createReview(userId, reviewData);

//             expect(review).not.toBeNull();
//         });

//         it("should throw an error if the submission does not exist", async () => {
//             const reviewData = {
//                 submissionId: "nonExistentSubmissionId",
//                 reviewerId: "testReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: true
//             };

//             await expect(reviewService.createReview(reviewData)).rejects.toThrow(
//                 apiError
//             );
//         });

//         it("should throw an error if the reviewer does not exist", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId",
//                 reviewerId: "nonExistentReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: true
//             };

//             await expect(reviewService.createReview(reviewData)).rejects.toThrow(
//                 apiError
//             );
//         });

//         it("should throw an error if the reviewee does not exist", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId",
//                 reviewerId: "testReviewerId",
//                 revieweeId: "nonExistentRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: true
//             };

//             await expect(reviewService.createReview(reviewData)).rejects.toThrow(
//                 apiError
//             );
//         });

//         it("should throw an error if the review grade is not a number", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId",
//                 reviewerId: "testReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: "notANumber",
//                 isPeerReview: true
//             };

//             await expect(reviewService.createReview(reviewData)).rejects.toThrow(
//                 apiError
//             );
//         });
//     });

//     describe("getReviewById", () => {
//         it("should return a review by ID", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId",
//                 reviewerId: "testReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: true
//             };

//             const review = await reviewService.createReview(reviewData);

//             const foundReview = await reviewService.getReviewById(review.reviewId);

//             expect(foundReview).not.toBeNull();
//         });

//         it("should throw an error if the review does not exist", async () => {
//             await expect(reviewService.getReviewById("nonExistentReviewId")).rejects.toThrow(
//                 apiError
//             );
//         });
//     });

//     describe("updateReview", () => {
//         it("should update a review", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId",
//                 reviewerId: "testReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: true
//             };

//             const review = await reviewService.createReview(reviewData);

//             const updatedReview = await reviewService.updateReview(review.reviewId, {
//                 reviewGrade: 4
//             });

//             expect(updatedReview.reviewGrade).toBe(4);
//         });

//         it("should throw an error if the review does not exist", async () => {
//             await expect(reviewService.updateReview("nonExistentReviewId", { reviewGrade: 4 })).rejects.toThrow(
//                 apiError
//             );
//         });
//     });

//     describe("deleteReview", () => {
//         it("should delete a review", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId",
//                 reviewerId: "testReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: true
//             };

//             const review = await reviewService.createReview(reviewData);

//             await reviewService.deleteReview(review.reviewId);

//             await expect(reviewService.getReviewById(review.reviewId)).rejects.toThrow(
//                 apiError
//             );
//         });

//         it("should throw an error if the review does not exist", async () => {
//             await expect(reviewService.deleteReview("nonExistentReviewId")).rejects.toThrow(
//                 apiError
//             );
//         });
//     });

//     describe("getPeerReviewsBySubmissionId", () => {
//         it("should return all peer reviews for a submission", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId",
//                 reviewerId: "testReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: true
//             };

//             await reviewService.createReview(reviewData);

//             const reviews = await reviewService.getPeerReviews("testSubmissionId");

//             expect(reviews).not.toBeNull();
//         });

//         it("should throw an error if the submission does not exist", async () => {
//             await expect(reviewService.getPeerReviewsBySubmissionId("nonExistentSubmissionId")).rejects.toThrow(
//                 apiError
//             );
//         });
//     });

//     describe("getInstructorReviewsBySubmissionId", () => {
//         it("should return all instructor reviews for a submission", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId",
//                 reviewerId: "testReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: false
//             };

//             await reviewService.createReview(reviewData);

//             const reviews = await reviewService.getInstructorReview("testSubmissionId");

//             expect(reviews).not.toBeNull();
//         });

//         it("should throw an error if the submission does not exist", async () => {
//             await expect(reviewService.getInstructionReviewsBySubmissionId("nonExistentSubmissionId")).rejects.toThrow(
//                 apiError
//             );
//         });
//     });

//     describe("getAllReviews", () => {
//         it("should return all reviews", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId",
//                 reviewerId: "testReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: true
//             };

//             await reviewService.createReview(reviewData);

//             const reviews = await reviewService.getAllReviews();

//             expect(reviews).not.toBeNull();
//         });
//     });

//     describe("getReviewDetails", () => {
//         it("should return review details", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId",
//                 reviewerId: "testReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: true
//             };

//             const review = await reviewService.createReview(reviewData);

//             const reviewDetails = await reviewService.getReviewDetails(review.reviewId);

//             expect(reviewDetails).not.toBeNull();
//         });

//         it("should throw an error if the review does not exist", async () => {
//             await expect(reviewService.getReviewDetails("nonExistentReviewId")).rejects.toThrow(
//                 apiError
//             );
//         });
//     });

//     describe("getReviewsAssignedToUser", () => {
//         it("should return all reviews assigned to a user", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId",
//                 reviewerId: "testReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: true
//             };

//             await reviewService.createReview(reviewData);

//             const reviews = await reviewService.getReviewsAssigned(userId);

//             expect(reviews).not.toBeNull();
//         });

//         it("should throw an error if the user does not exist", async () => {
//             await expect(reviewService.getReviewsAssignedToUser("nonExistentUserId")).rejects.toThrow(
//                 apiError
//             );
//         });
//     });

//     describe("getReviewsRecievedByUser", () => {
//         it("should return all reviews recieved by a user", async () => {
//             const reviewData = {
//                 submissionId: "testSubmissionId",
//                 reviewerId: "testReviewerId",
//                 revieweeId: "testRevieweeId",
//                 reviewGrade: 5,
//                 isPeerReview: true
//             };

//             await reviewService.createReview(reviewData);

//             const reviews = await reviewService.getReviewsReceived(userId);

//             expect(reviews).not.toBeNull();
//         });

//         it("should throw an error if the user does not exist", async () => {
//             await expect(reviewService.getReviewsRecievedByUser("nonExistentUserId")).rejects.toThrow(
//                 apiError
//             );
//         });
//     });
// });
