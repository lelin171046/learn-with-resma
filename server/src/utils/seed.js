const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Blog = require('../models/Blog');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learn-with-resma';

const seedCategories = [
  { name: 'English Speaking', slug: 'english-speaking', description: 'Courses for improving spoken English fluency and confidence', icon: '🗣️', sortOrder: 1 },
  { name: 'English Writing', slug: 'english-writing', description: 'Master written English from essays to professional emails', icon: '✍️', sortOrder: 2 },
  { name: 'English Listening', slug: 'english-listening', description: 'Improve listening comprehension and understanding', icon: '👂', sortOrder: 3 },
  { name: 'IELTS Preparation', slug: 'ielts-preparation', description: 'Complete IELTS preparation courses for band 7+', icon: '📝', sortOrder: 4 },
  { name: 'Pronunciation', slug: 'pronunciation', description: 'Perfect your English pronunciation and accent', icon: '🎤', sortOrder: 5 },
  { name: 'Grammar', slug: 'grammar', description: 'Master English grammar from basics to advanced', icon: '📖', sortOrder: 6 },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Blog.deleteMany({});
    console.log('Cleared existing data.');

    const superAdmin = await User.create({
      name: 'Resma',
      email: 'admin@learnwithresma.com',
      password: 'admin123',
      role: 'superadmin',
      isEmailVerified: true,
      avatar: 'https://i.ibb.co.com/3mWkM45m/Gemini-Generated-Image-6ahs9h6ahs9h6ahs.png',
    });

    const admin = await User.create({
      name: 'Admin',
      email: 'admin2@learnwithresma.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true,
    });

    const student = await User.create({
      name: 'John Student',
      email: 'student@example.com',
      password: 'student123',
      role: 'student',
      isEmailVerified: true,
    });

    console.log('Users created: superadmin, admin, student');

    const categories = await Category.insertMany(seedCategories);
    console.log(`${categories.length} categories created.`);

    const courses = await Course.insertMany([
      {
        title: 'Complete English Speaking Course',
        slug: 'complete-english-speaking-course',
        description: '<p>Master English speaking from beginner to advanced. This comprehensive course covers daily conversation, business English, public speaking, and fluency techniques.</p><h3>What You Will Learn</h3><ul><li>Daily conversation skills</li><li>Business English</li><li>Public speaking</li><li>Fluency techniques</li></ul>',
        shortDescription: 'Master English speaking from beginner to advanced level.',
        thumbnail: 'https://placehold.co/400x250/2563EB/ffffff?text=Speaking+Course',
        category: categories[0]._id,
        instructor: superAdmin._id,
        price: 0,
        isFree: true,
        level: 'beginner',
        duration: '20 hours',
        tags: ['speaking', 'fluency', 'conversation'],
        isPublished: true,
        isFeatured: true,
        requirements: ['Basic English knowledge', 'Willingness to practice'],
        learningOutcomes: ['Speak English confidently', 'Master daily conversations', 'Present in English professionally'],
      },
      {
        title: 'IELTS Preparation Masterclass',
        slug: 'ielts-preparation-masterclass',
        description: '<p>Complete IELTS preparation course covering all four modules: Listening, Reading, Writing, and Speaking. Designed to help you achieve band 7+.</p><h3>Course Modules</h3><ul><li>IELTS Listening strategies</li><li>IELTS Reading techniques</li><li>IELTS Writing Task 1 & 2</li><li>IELTS Speaking parts 1, 2 & 3</li></ul>',
        shortDescription: 'Achieve band 7+ in IELTS with proven strategies.',
        thumbnail: 'https://placehold.co/400x250/F59E0B/ffffff?text=IELTS+Course',
        category: categories[3]._id,
        instructor: superAdmin._id,
        price: 49.99,
        isFree: false,
        level: 'intermediate',
        duration: '30 hours',
        tags: ['ielts', 'test-prep', 'band-7'],
        isPublished: true,
        isFeatured: true,
        requirements: ['Intermediate English level', 'Basic exam awareness'],
        learningOutcomes: ['Score band 7+ in IELTS', 'Master all IELTS modules', 'Time management for exams'],
      },
      {
        title: 'English Writing Skills - From Beginner to Pro',
        slug: 'english-writing-skills',
        description: '<p>Learn to write clear, effective English in any context - essays, emails, reports, and creative writing.</p>',
        shortDescription: 'Master English writing for academic and professional use.',
        thumbnail: 'https://placehold.co/400x250/0F172A/ffffff?text=Writing+Course',
        category: categories[1]._id,
        instructor: admin._id,
        price: 29.99,
        isFree: false,
        level: 'beginner',
        duration: '15 hours',
        tags: ['writing', 'essays', 'professional'],
        isPublished: true,
        isFeatured: false,
        learningOutcomes: ['Write professional emails', 'Craft strong essays', 'Improve grammar in writing'],
      },
      {
        title: 'English Listening Comprehension',
        slug: 'english-listening-comprehension',
        description: '<p>Improve your English listening skills with real-world audio, podcasts, and dictation exercises.</p>',
        shortDescription: 'Train your ears to understand native English speakers.',
        thumbnail: 'https://placehold.co/400x250/10B981/ffffff?text=Listening+Course',
        category: categories[2]._id,
        instructor: superAdmin._id,
        price: 0,
        isFree: true,
        level: 'beginner',
        duration: '10 hours',
        tags: ['listening', 'comprehension', 'audio'],
        isPublished: true,
        isFeatured: false,
        learningOutcomes: ['Understand native speakers', 'Improve note-taking', 'Follow English media'],
      },
      {
        title: 'Perfect English Pronunciation',
        slug: 'perfect-english-pronunciation',
        description: '<p>Master the sounds of American and British English. Learn IPA, stress patterns, and connected speech.</p>',
        shortDescription: 'Sound like a native with proper pronunciation techniques.',
        thumbnail: 'https://placehold.co/400x250/8B5CF6/ffffff?text=Pronunciation',
        category: categories[4]._id,
        instructor: superAdmin._id,
        price: 19.99,
        isFree: false,
        level: 'intermediate',
        duration: '12 hours',
        tags: ['pronunciation', 'accent', 'phonetics'],
        isPublished: true,
        isFeatured: true,
        learningOutcomes: ['Master all English sounds', 'Improve intonation', 'Reduce native accent'],
      },
      {
        title: 'Advanced Grammar Mastery',
        slug: 'advanced-grammar-mastery',
        description: '<p>Take your grammar to the next level with advanced tenses, conditionals, reported speech, and more.</p>',
        shortDescription: 'Master advanced English grammar structures.',
        thumbnail: 'https://placehold.co/400x250/EC4899/ffffff?text=Grammar+Course',
        category: categories[5]._id,
        instructor: admin._id,
        price: 0,
        isFree: true,
        level: 'advanced',
        duration: '18 hours',
        tags: ['grammar', 'advanced', 'tenses'],
        isPublished: true,
        isFeatured: false,
        learningOutcomes: ['Master advanced tenses', 'Use conditionals perfectly', 'Write error-free English'],
      },
    ]);

    console.log(`${courses.length} courses created.`);

    const lessons = [];
    for (const course of courses) {
      const numLessons = Math.floor(Math.random() * 4) + 5;
      for (let i = 1; i <= numLessons; i++) {
        lessons.push({
          course: course._id,
          title: `Lesson ${i}: ${course.title} - Part ${i}`,
          description: `This lesson covers part ${i} of ${course.title}. Follow along with the video and practice the exercises.`,
          videoUrl: i === 1 ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : '',
          videoType: 'youtube',
          duration: `${10 + Math.floor(Math.random() * 20)} min`,
          sortOrder: i,
          isFree: i <= 2,
          isPublished: true,
          hasQuiz: i % 2 === 0,
          pdfNotes: i === 1 ? [{ title: 'Lesson Notes', url: '#' }] : [],
        });
      }
    }

    const createdLessons = await Lesson.insertMany(lessons);
    console.log(`${createdLessons.length} lessons created.`);

    for (const course of courses) {
      await Course.findByIdAndUpdate(course._id, {
        totalLessons: createdLessons.filter((l) => l.course.toString() === course._id.toString()).length,
      });
    }

    const quizzes = [];
    for (const course of courses) {
      const courseLessons = createdLessons.filter((l) => l.course.toString() === course._id.toString() && l.hasQuiz);
      for (const lesson of courseLessons.slice(0, 2)) {
        quizzes.push({
          lesson: lesson._id,
          course: course._id,
          title: `Quiz: ${lesson.title}`,
          type: 'lesson',
          passingScore: 80,
          questions: [
            { questionText: 'Which is a correct English sentence?', options: ['Me go store', 'I go to the store', 'Me store go', 'Go I store to'], correctAnswer: 1, explanation: 'Subject + Verb + Prepositional Phrase is the correct structure.' },
            { questionText: 'What does "fluent" mean?', options: ['Slow', 'Able to speak easily and smoothly', 'Difficult', 'Angry'], correctAnswer: 1, explanation: 'Fluent means able to express oneself easily and articulately.' },
            { questionText: 'Choose the correct past tense: She ___ to school.', options: ['go', 'goed', 'went', 'goned'], correctAnswer: 2, explanation: 'The past tense of "go" is "went" (irregular verb).' },
            { questionText: 'Which word is a noun?', options: ['Run', 'Beautiful', 'Happiness', 'Quickly'], correctAnswer: 2, explanation: '"Happiness" is a noun. The others are a verb, adjective, and adverb.' },
            { questionText: 'Complete: I have been ___ English for 3 years.', options: ['study', 'studied', 'studying', 'studyed'], correctAnswer: 2, explanation: 'Present perfect continuous uses have/has + been + verb-ing.' },
          ],
          isPublished: true,
        });
      }
    }

    await Quiz.insertMany(quizzes);
    console.log(`${quizzes.length} quizzes created.`);

    await Blog.insertMany([
      {
        title: '10 Tips to Improve Your English Speaking',
        slug: '10-tips-improve-english-speaking',
        content: '<p>Speaking English fluently is a goal for millions of learners worldwide. Here are 10 proven tips to help you improve your English speaking skills effectively.</p><h3>1. Practice Daily</h3><p>Consistency is key. Spend at least 15 minutes every day speaking English, even if it is just talking to yourself.</p><h3>2. Think in English</h3><p>Stop translating from your native language. Start thinking directly in English to improve fluency.</p><h3>3. Listen and Repeat</h3><p>Listen to native speakers and repeat what they say. This helps with pronunciation and rhythm.</p>',
        excerpt: 'Discover 10 powerful tips to boost your English speaking skills and become fluent faster.',
        thumbnail: 'https://placehold.co/600x300/2563EB/ffffff?text=Speaking+Tips',
        author: superAdmin._id,
        tags: ['speaking', 'tips', 'fluency'],
        category: 'Speaking',
        isPublished: true,
        views: 245,
      },
      {
        title: 'How to Prepare for IELTS Writing Task 2',
        slug: 'prepare-ielts-writing-task-2',
        content: '<p>IELTS Writing Task 2 is often the most challenging part of the exam. Here is a complete guide to help you prepare effectively.</p><h3>Understanding the Task</h3><p>You need to write a 250-word essay in response to a prompt. The essay is assessed on Task Response, Coherence, Lexical Resource, and Grammar.</p><h3>Essay Structure</h3><p>Introduction - State your position. Body Paragraph 1 - First argument. Body Paragraph 2 - Second argument. Conclusion - Summarize.</p>',
        excerpt: 'A complete guide to scoring band 7+ in IELTS Writing Task 2.',
        thumbnail: 'https://placehold.co/600x300/F59E0B/ffffff?text=IELTS+Writing',
        author: superAdmin._id,
        tags: ['ielts', 'writing', 'task-2'],
        category: 'IELTS',
        isPublished: true,
        views: 189,
      },
    ]);
    console.log('2 blog posts created.');

    console.log('\n--- Seed Complete ---');
    console.log('Super Admin: admin@learnwithresma.com / admin123');
    console.log('Admin: admin2@learnwithresma.com / admin123');
    console.log('Student: student@example.com / student123');
    console.log('----------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
