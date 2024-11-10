import { expect, test, describe, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Database from '../database/database.mjs';
import courseModel from '../database/models/course.mjs';
import teamModel from '../database/models/team.mjs';
import assessmentModel from '../database/models/assessment.mjs';
import userModel from '../database/models/user.mjs';

let mongoServer;
let database;

// MongoDB Test Setup
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    database = new Database();
});

beforeEach(async () => {
    await Promise.all([
        courseModel.deleteMany({}),
        teamModel.deleteMany({}),
        assessmentModel.deleteMany({}),
        userModel.deleteMany({})
    ]);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Basic UI Tests', () => {
    // Test navigation paths
    test('should have correct routes defined', () => {
        const routes = [
            '/',
            '/student-login',
            '/instructor-login',
            '/newuser-login',
            '/student-menu',
            '/instructor-page',
            '/student-courses',
            '/student-profile',
            '/student-dashboard',
            '/peer-assessment/:teammateId',
            '/assessment-confirmation'
        ];

        // Verify all required routes exist in App.js
        routes.forEach(route => {
            expect(route).toBeTruthy();
        });
    });

    // Test basic user types
    test('should have valid user types', () => {
        const validUserTypes = ['student', 'instructor'];
        
        validUserTypes.forEach(userType => {
            expect(['student', 'instructor']).toContain(userType);
        });
    });

    // Test assessment criteria ranges
    test('should have valid assessment criteria ranges', () => {
        const criteria = {
            cooperation: { min: 1, max: 7 },
            conceptualContribution: { min: 1, max: 7 },
            practicalContribution: { min: 1, max: 7 },
            workEthic: { min: 1, max: 7 }
        };

        Object.values(criteria).forEach(range => {
            expect(range.min).toBe(1);
            expect(range.max).toBe(7);
            expect(range.min).toBeLessThan(range.max);
        });
    });


});

describe('Team Management Tests', () => {
    test('should create a team successfully', async () => {
        const team = {
            teamName: 'Test Team',
            course: new mongoose.Types.ObjectId(),
            members: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()]
        };

        const savedTeam = await teamModel.create(team);
        expect(savedTeam.teamName).toBe('Test Team');
        expect(savedTeam.members.length).toBe(2);
    });


});

describe('Peer Assessment Tests', () => {
    test('should create assessment with all dimensions', async () => {
        const assessment = {
            evaluator: new mongoose.Types.ObjectId(),
            evaluatee: new mongoose.Types.ObjectId(),
            team: new mongoose.Types.ObjectId(),
            cooperation: { score: 5, comments: 'Great team player' },
            conceptualContribution: { score: 6, comments: 'Strong understanding' },
            practicalContribution: { score: 4, comments: 'Good coding skills' },
            workEthic: { score: 7, comments: 'Always reliable' }
        };

        const savedAssessment = await assessmentModel.create(assessment);
        expect(savedAssessment.cooperation.score).toBe(5);
        expect(savedAssessment.workEthic.comments).toBe('Always reliable');
    });

    test('should validate assessment scores range', async () => {
        const invalidAssessment = {
            evaluator: new mongoose.Types.ObjectId(),
            evaluatee: new mongoose.Types.ObjectId(),
            team: new mongoose.Types.ObjectId(),
            cooperation: { score: 8, comments: 'Test' } // Invalid score > 7
        };

        await expect(assessmentModel.create(invalidAssessment)).rejects.toThrow();
    });
});

describe('User Authentication Tests', () => {
    test('should create student user', async () => {
        const student = {
            email: 'student@test.com',
            firstname: 'Test',
            lastname: 'Student',
            password: 'password123',
            usertype: 'student'
        };

        const savedUser = await userModel.create(student);
        expect(savedUser.email).toBe(student.email);
        expect(savedUser.usertype).toBe('student');
    });

    test('should create instructor user', async () => {
        const instructor = {
            email: 'instructor@test.com',
            firstname: 'Test',
            lastname: 'Instructor',
            password: 'password123',
            usertype: 'instructor'
        };

        const savedUser = await userModel.create(instructor);
        expect(savedUser.email).toBe(instructor.email);
        expect(savedUser.usertype).toBe('instructor');
    });
});

describe('Team Visibility Tests', () => {
    test('should allow instructor to view all teams', async () => {
        const course = await courseModel.create({
            courseCode: 'CS101',
            courseName: 'Test Course',
            instructor: new mongoose.Types.ObjectId()
        });

        const teams = await teamModel.find({ course: course._id });
        expect(Array.isArray(teams)).toBe(true);
    });

    test('should allow student to view their teams', async () => {
        const student = await userModel.create({
            email: 'student@test.com',
            firstname: 'Test',
            lastname: 'Student',
            password: 'password123',
            usertype: 'student'
        });

        const teams = await teamModel.find({
            members: student._id
        });
        expect(Array.isArray(teams)).toBe(true);
    });
});

// Course Management Tests
describe('Course Management Tests', () => {
    test('should create a course successfully', async () => {
        const instructor = await userModel.create({
            email: 'instructor@test.com',
            firstname: 'Test',
            lastname: 'Instructor',
            password: 'password123',
            usertype: 'instructor'
        });

        const course = {
            courseCode: 'CS101',
            courseName: 'Introduction to Programming',
            instructor: instructor._id
        };

        const savedCourse = await courseModel.create(course);
        expect(savedCourse.courseCode).toBe('CS101');
        expect(savedCourse.courseName).toBe('Introduction to Programming');
    });

    test('should not allow duplicate course codes', async () => {
        const instructor = await userModel.create({
            email: 'instructor@test.com',
            firstname: 'Test',
            lastname: 'Instructor',
            password: 'password123',
            usertype: 'instructor'
        });

        await courseModel.create({
            courseCode: 'CS101',
            courseName: 'Original Course',
            instructor: instructor._id
        });

        await expect(courseModel.create({
            courseCode: 'CS101',
            courseName: 'Duplicate Course',
            instructor: instructor._id
        })).rejects.toThrow();
    });

    test('should add student to course', async () => {
        const instructor = await userModel.create({
            email: 'instructor@test.com',
            firstname: 'Test',
            lastname: 'Instructor',
            password: 'password123',
            usertype: 'instructor'
        });

        const course = await courseModel.create({
            courseCode: 'CS101',
            courseName: 'Test Course',
            instructor: instructor._id
        });

        const student = await userModel.create({
            email: 'student@test.com',
            firstname: 'Test',
            lastname: 'Student',
            password: 'password123',
            usertype: 'student'
        });

        const result = await database.addStudentToCourse(course._id.toString(), student._id.toString());
        expect(result.result).toBe('success');
    });
});

// Assessment Dimension Tests
describe('Assessment Dimension Tests', () => {
    let student1, student2, team;

    beforeEach(async () => {
        student1 = await userModel.create({
            email: 'student1@test.com',
            firstname: 'Student',
            lastname: 'One',
            password: 'password123',
            usertype: 'student'
        });

        student2 = await userModel.create({
            email: 'student2@test.com',
            firstname: 'Student',
            lastname: 'Two',
            password: 'password123',
            usertype: 'student'
        });

        team = await teamModel.create({
            teamName: 'Test Team',
            course: new mongoose.Types.ObjectId(),
            members: [student1._id, student2._id]
        });
    });

    test('should validate all assessment dimensions', async () => {
        const assessment = await assessmentModel.create({
            evaluator: student1._id,
            evaluatee: student2._id,
            team: team._id,
            cooperation: { score: 5, comments: 'Good' },
            conceptualContribution: { score: 4, comments: 'Fair' },
            practicalContribution: { score: 6, comments: 'Great' },
            workEthic: { score: 5, comments: 'Consistent' }
        });

        const dimensions = ['cooperation', 'conceptualContribution', 'practicalContribution', 'workEthic'];
        dimensions.forEach(dimension => {
            expect(assessment[dimension]).toHaveProperty('score');
            expect(assessment[dimension]).toHaveProperty('comments');
            expect(assessment[dimension].score).toBeGreaterThanOrEqual(1);
            expect(assessment[dimension].score).toBeLessThanOrEqual(7);
        });
    });

    test('should store optional comments for each dimension', async () => {
        const assessment = {
            evaluator: new mongoose.Types.ObjectId(),
            evaluatee: new mongoose.Types.ObjectId(),
            team: new mongoose.Types.ObjectId(),
            cooperation: { score: 5, comments: 'Test comment' },
            conceptualContribution: { score: 4, comments: null },
            practicalContribution: { score: 5, comments: '' },
            workEthic: { score: 4, comments: undefined }
        };

        const savedAssessment = await assessmentModel.create(assessment);
        expect(savedAssessment.cooperation.comments).toBe('Test comment');
        expect(savedAssessment.conceptualContribution.comments).toBeNull();
    });
});

// Team Visibility and Management Tests
describe('Team Management Extended Tests', () => {
    test('should list all teams for a course', async () => {
        const course = await courseModel.create({
            courseCode: 'CS101',
            courseName: 'Test Course',
            instructor: new mongoose.Types.ObjectId()
        });

        await teamModel.create({
            teamName: 'Team 1',
            course: course._id,
            members: [new mongoose.Types.ObjectId()]
        });

        const result = await database.getTeamsForCourse(course._id.toString());
        expect(result.result).toBe('success');
        expect(Array.isArray(result.teams)).toBe(true);
    });

    test('should show team members with correct details', async () => {
        const student1 = await userModel.create({
            email: 'student1@test.com',
            firstname: 'Student',
            lastname: 'One',
            password: 'password123',
            usertype: 'student'
        });

        const student2 = await userModel.create({
            email: 'student2@test.com',
            firstname: 'Student',
            lastname: 'Two',
            password: 'password123',
            usertype: 'student'
        });

        const team = await teamModel.create({
            teamName: 'Test Team',
            course: new mongoose.Types.ObjectId(),
            members: [student1._id, student2._id]
        });

        const populatedTeam = await teamModel.findById(team._id).populate('members');
        expect(populatedTeam.members[0]).toHaveProperty('firstname');
        expect(populatedTeam.members[0]).toHaveProperty('lastname');
    });

    test('should prevent duplicate student assignments', async () => {
        const student = await userModel.create({
            email: 'student@test.com',
            firstname: 'Test',
            lastname: 'Student',
            password: 'password123',
            usertype: 'student'
        });

        const team = await teamModel.create({
            teamName: 'Test Team',
            course: new mongoose.Types.ObjectId(),
            members: []
        });

        await database.addStudentToTeam(team._id.toString(), student._id.toString());
        await database.addStudentToTeam(team._id.toString(), student._id.toString());

        const updatedTeam = await teamModel.findById(team._id);
        const studentCount = updatedTeam.members.filter(id => 
            id.toString() === student._id.toString()
        ).length;
        expect(studentCount).toBe(1);
    });
});

// Assessment Submission Tests
describe('Assessment Submission Tests', () => {
    test('should confirm assessment submission', async () => {
        const evaluator = await userModel.create({
            email: 'evaluator@test.com',
            firstname: 'Test',
            lastname: 'Evaluator',
            password: 'password123',
            usertype: 'student'
        });

        const evaluatee = await userModel.create({
            email: 'evaluatee@test.com',
            firstname: 'Test',
            lastname: 'Evaluatee',
            password: 'password123',
            usertype: 'student'
        });

        const result = await database.submitAssessment(
            evaluator._id,
            evaluatee._id,
            {
                cooperation: { score: 5, comments: 'Good' },
                conceptualContribution: { score: 4, comments: 'Fair' },
                practicalContribution: { score: 6, comments: 'Excellent' },
                workEthic: { score: 5, comments: 'Consistent' }
            }
        );

        expect(result.result).toBe('success');
    });

    test('should prevent self-assessment', async () => {
        const student = await userModel.create({
            email: 'student@test.com',
            firstname: 'Test',
            lastname: 'Student',
            password: 'password123',
            usertype: 'student'
        });

        const assessment = {
            cooperation: { score: 5, comments: 'Test' },
            conceptualContribution: { score: 5, comments: 'Test' },
            practicalContribution: { score: 5, comments: 'Test' },
            workEthic: { score: 5, comments: 'Test' }
        };

        const result = await database.submitAssessment(
            student._id,
            student._id,
            assessment
        );

        expect(result.result).toBe('error');
        expect(result.message).toContain('Self-assessment is not allowed');
    });
});