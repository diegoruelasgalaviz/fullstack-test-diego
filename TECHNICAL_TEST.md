# Aura Research Full Stack Technical Test

## Overview

This repository contains a full stack technical assessment for candidates applying to Aura Research. The core of this assessment is a series of **business-critical challenges** that you must solve within a CRM (Customer Relationship Management) application. Your primary goal is to complete these challenges to demonstrate your technical abilities and problem-solving approach.

## Purpose

The purpose of this technical test is to evaluate your skills in:

1. **Full Stack Development**: Working with both frontend and backend technologies
2. **Clean Architecture**: Implementing domain-driven design principles
3. **TypeScript**: Using strong typing across the entire stack
4. **Testing**: Writing and running tests for both frontend and backend
5. **Database Design**: Working with relational databases and ORM tools

## The Challenge-Based Assessment

**The challenges are the heart of this technical test.** Each challenge represents a real-world business need that must be addressed in the CRM application. Your primary task is to complete enough challenges to meet the minimum point requirement.

As a candidate, you are expected to:

1. **Complete Business-Critical Challenges**: Implement solutions for the challenges in the `/challenges` directory
2. **Understand the Existing Codebase**: Navigate and comprehend the architecture and patterns used
3. **Implement New Features**: Add functionality to both frontend and backend components
4. **Write Tests**: Ensure proper test coverage for your implementations
5. **Document Your Work**: Provide clear documentation of your approach and decisions

## Challenge Point System

This technical test uses a point-based evaluation system:

- Each challenge has a specific point value based on its business importance
- You must earn a minimum of 70 points to successfully complete the test
- You must complete at least one Critical priority challenge (30 points)
- You must complete at least one High priority challenge (20 points)
- The remaining points can be earned by completing any combination of challenges

**Important Note:** You are NOT required to complete all challenges. Focus on reaching the minimum 70 points by implementing the challenges that best showcase your skills. Quality of implementation is more important than quantity of challenges completed.

### Challenge Priorities

Importantly, challenge priorities (Critical, High, Medium, Low) reflect **business value** rather than technical difficulty. A Critical priority challenge addresses a core business need, while a Low priority challenge, though still valuable, may have less immediate impact on business operations.

Detailed information about the point system can be found in the `POINT_SYSTEM.md` file, and each challenge file includes its point value in the title.

## Technical Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- TailwindCSS for styling
- Vite as the build tool
- Vitest for testing

### Backend
- Node.js with TypeScript
- Express for the web server
- TypeORM for database interactions
- PostgreSQL as the database
- JWT for authentication
- Clean Architecture principles

## Evaluation Criteria

Your submission will be evaluated primarily on **successful challenge completion** and the points earned. Additionally, we will assess:

1. **Challenge Implementation**: How effectively you solved the business problems presented in the challenges
2. **Code Quality**: Clean, maintainable, and well-structured code that follows best practices
3. **Architecture**: Proper separation of concerns and adherence to clean architecture principles
4. **Testing**: Comprehensive test coverage for your implementations
5. **Documentation**: Clear explanation of your approach, decisions, and trade-offs

## Getting Started & Submission Process

1. Fork this repository to your GitHub account
2. Set up the project following instructions in README.md
3. Review the challenges in `/challenges` and their point values
4. Complete enough challenges to earn at least 70 points, including:
   - At least one Critical challenge (30 points)
   - At least one High priority challenge (20 points)
5. Create a single Pull Request with your implementations
6. In your PR description, include:
   - List of completed challenges with their point values
   - Total points earned
   - Brief explanation of your approach and key decisions
7. Provide access to your repository to the Aura Research team

## Time Allocation

You are expected to spend approximately 4-6 hours on this test. We value quality over quantity, so focus on delivering well-structured and tested code rather than implementing all features if time is limited.

## Support

If you have any questions or need clarification about the test, please reach out to the Aura Research team at mpat@aura.

Good luck, and we look forward to reviewing your submission!
