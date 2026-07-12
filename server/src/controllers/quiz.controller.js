const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');

exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuizzesByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuizByLesson = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ lesson: req.params.lessonId });
    if (!quiz) return res.status(404).json({ success: false, message: 'No quiz for this lesson' });
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    const { answers } = req.body;
    let correct = 0;
    const results = quiz.questions.map((q, i) => {
      const isCorrect = q.correctAnswer === answers[i];
      if (isCorrect) correct++;
      return { questionIndex: i, selectedOption: answers[i], isCorrect };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    let progress = await Progress.findOne({ user: req.user._id, course: quiz.course });
    if (progress) {
      const existingResult = progress.quizResults.findIndex((r) => r.quiz.toString() === quiz._id.toString());
      const resultData = { quiz: quiz._id, score, passed, answers: results };

      if (existingResult > -1) {
        progress.quizResults[existingResult] = resultData;
      } else {
        progress.quizResults.push(resultData);
      }

      if (passed && !progress.completedQuizzes.includes(quiz._id)) {
        progress.completedQuizzes.push(quiz._id);
      }
      await progress.save({ validateBeforeSave: false });
    }

    res.json({ success: true, score, passed, total: quiz.questions.length, correct, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const query = {};
    if (type) query.type = type;

    const quizzes = await Quiz.find(query).populate('course', 'title').populate('lesson', 'title').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);
    const total = await Quiz.countDocuments(query);

    res.json({ success: true, quizzes, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
