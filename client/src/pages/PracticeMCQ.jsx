import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiX, FiArrowLeft, FiBookOpen, FiAward, FiRotateCw, FiTarget } from 'react-icons/fi';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const topicCategories = [
  { id: 'grammar', title: 'Grammar', icon: '📝', desc: 'Tenses, clauses, and sentence structure', color: 'from-blue-500 to-blue-600' },
  { id: 'vocabulary', title: 'Vocabulary', icon: '📖', desc: 'Words, phrases, and collocations', color: 'from-green-500 to-green-600' },
  { id: 'listening', title: 'Listening', icon: '🎧', desc: 'Comprehension and note-taking', color: 'from-purple-500 to-purple-600' },
  { id: 'writing', title: 'Writing', icon: '✍️', desc: 'Essay structure and grammar', color: 'from-orange-500 to-orange-600' },
  { id: 'ielts', title: 'IELTS', icon: '🎯', desc: 'Academic and general training', color: 'from-red-500 to-red-600' },
  { id: 'pronunciation', title: 'Pronunciation', icon: '🗣️', desc: 'Sounds, stress, and intonation', color: 'from-teal-500 to-teal-600' },
];

const quizData = {
  grammar: [
    { question: 'Which sentence uses the correct present perfect tense?', options: ['I have went to school.', 'I have gone to school.', 'I has gone to school.', 'I have going to school.'], correct: 1, explanation: '"Have gone" is the correct present perfect form using have/has + past participle.' },
    { question: 'Choose the correct conditional: "If it rains, I ___ stay home."', options: ['will', 'would', 'am going', 'was'], correct: 0, explanation: 'First conditional uses "if + present simple, will + base verb" for real future possibilities.' },
    { question: 'Which sentence is in the passive voice?', options: ['The cat chased the mouse.', 'The mouse was chased by the cat.', 'The cat is chasing the mouse.', 'The cat will chase the mouse.'], correct: 1, explanation: 'Passive voice uses "was/were + past participle" and the subject receives the action.' },
    { question: 'Identify the correct use of "who" vs "whom":', options: ['Who did you call?', 'Whom is coming to dinner?', 'To who should I address this?', 'Whom do you think won?'], correct: 0, explanation: '"Who" is used as a subject pronoun (who did you call?). "Whom" is used as an object after prepositions.' },
    { question: 'Which is the correct comparative form?', options: ['More better', 'Gooder', 'Better', 'Most good'], correct: 2, explanation: '"Better" is the irregular comparative form of "good." We don\'t use "more" with irregular comparatives.' },
  ],
  vocabulary: [
    { question: 'What does "ubiquitous" mean?', options: ['Rare', 'Found everywhere', 'Unique', 'Uncertain'], correct: 1, explanation: '"Ubiquitous" means present, appearing, or found everywhere. Example: Smartphones are ubiquitous in modern life.' },
    { question: 'Choose the word that best fits: "The scientist made a ___ discovery."', options: ['groundbreaking', 'groundly', 'grounded', 'grounding'], correct: 0, explanation: '"Groundbreaking" means innovative and pioneering. It collocates naturally with "discovery."' },
    { question: 'What is a synonym for "benevolent"?', options: ['Cruel', 'Kind', 'Angry', 'Weak'], correct: 1, explanation: '"Benevolent" means well-meaning and kindly, making "kind" the closest synonym.' },
    { question: 'Which word means "to make something less severe"?', options: ['Aggravate', 'Mitigate', 'Navigate', 'Motivate'], correct: 1, explanation: '"Mitigate" means to make less severe, serious, or painful.' },
    { question: 'What does the idiom "break the ice" mean?', options: ['To freeze something', 'To start a conversation', 'To cause trouble', 'To solve a problem'], correct: 1, explanation: '"Break the ice" means to initiate conversation in an awkward or tense social situation.' },
  ],
  listening: [
    { question: 'In IELTS Listening, what should you do before the audio plays?', options: ['Write answers immediately', 'Read the questions', 'Close your eyes', 'Start singing'], correct: 1, explanation: 'Always read the questions before the audio plays so you know what information to listen for.' },
    { question: 'Which note-taking strategy is most effective for lectures?', options: ['Writing every word', 'Recording audio only', 'Using abbreviations and symbols', 'Not taking any notes'], correct: 2, explanation: 'Abbreviations and symbols help you capture key information quickly without falling behind.' },
    { question: 'What is "inferencing" in listening comprehension?', options: ['Writing down everything heard', 'Guessing meaning from context', 'Speaking loudly', 'Repeating words'], correct: 1, explanation: 'Inferencing means using context clues to understand meaning that is not explicitly stated.' },
    { question: 'When listening to fast speech, what is most helpful?', options: ['Panic', 'Focus on key words and context', 'Stop listening', 'Write individual letters'], correct: 1, explanation: 'Focusing on key words and using context helps you understand the main ideas even at fast speeds.' },
    { question: 'What does "accent reduction" training involve?', options: ['Speaking louder', 'Learning phonetics and pronunciation patterns', 'Avoiding speaking', 'Using a different language'], correct: 1, explanation: 'Accent training focuses on phonetics, intonation, and pronunciation patterns to improve clarity.' },
  ],
  writing: [
    { question: 'What should a strong thesis statement include?', options: ['A question', 'A clear, specific claim', 'Multiple unrelated ideas', 'Only opinions'], correct: 1, explanation: 'A strong thesis statement presents a clear, specific, and arguable claim that guides the essay.' },
    { question: 'Which is the correct format for a formal email?', options: ['Hey! Whats up?', 'Dear Sir/Madam,', 'Yo dude,', 'Hi there!!!'], correct: 1, explanation: '"Dear Sir/Madam" is the appropriate formal greeting for professional emails.' },
    { question: 'What is a topic sentence?', options: ['The last sentence of an essay', 'A sentence that introduces the main idea of a paragraph', 'Any sentence with a topic word', 'A question at the end'], correct: 1, explanation: 'A topic sentence introduces the main idea of a paragraph and connects to the thesis.' },
    { question: 'In academic writing, what should you avoid?', options: ['Using evidence', 'Contractions and slang', 'Paragraph breaks', 'Clear structure'], correct: 1, explanation: 'Academic writing should be formal, avoiding contractions (don\'t, can\'t) and slang language.' },
    { question: 'What is the purpose of a conclusion paragraph?', options: ['Introduce new arguments', 'Summarize and restate the thesis', 'List references', 'Ask questions'], correct: 1, explanation: 'A conclusion summarizes the main points and restates the thesis without introducing new information.' },
  ],
  ielts: [
    { question: 'What is the maximum band score for IELTS?', options: ['8.0', '9.0', '10.0', '7.0'], correct: 1, explanation: 'The IELTS band score ranges from 0 to 9, with 9 being the highest (expert user).' },
    { question: 'How long is the IELTS Speaking test?', options: ['4-5 minutes', '11-14 minutes', '30 minutes', '60 minutes'], correct: 1, explanation: 'The IELTS Speaking test lasts 11-14 minutes and consists of 3 parts.' },
    { question: 'In IELTS Writing Task 2, what is the minimum word count?', options: ['150 words', '200 words', '250 words', '300 words'], correct: 2, explanation: 'IELTS Writing Task 2 requires a minimum of 250 words in a discursive essay format.' },
    { question: 'What is the best strategy for IELTS Reading?', options: ['Read every word carefully', 'Skim first, then scan for details', 'Read the questions last', 'Guess all answers'], correct: 1, explanation: 'Skimming for main ideas first, then scanning for specific details is the most effective strategy.' },
    { question: 'How many sections are in the IELTS Listening test?', options: ['2 sections', '3 sections', '4 sections', '5 sections'], correct: 2, explanation: 'IELTS Listening has 4 sections with 40 questions total, becoming progressively harder.' },
  ],
  pronunciation: [
    { question: 'How many vowel sounds are in standard British English?', options: ['10', '12', '20', '5'], correct: 1, explanation: 'Standard British English (RP) has 12 monophthong vowel sounds plus 8 diphthongs.' },
    { question: 'What is the difference between "ship" and "sheep"?', options: ['Consonant sound', 'Vowel length and quality', 'Number of syllables', 'Word stress'], correct: 1, explanation: 'The difference is in the vowel: /ɪ/ (short) in "ship" vs /iː/ (long) in "sheep."' },
    { question: 'What does "word stress" refer to?', options: ['Speaking loudly', 'Emphasis on a particular syllable', 'Pausing between words', 'Speaking quickly'], correct: 1, explanation: 'Word stress is the emphasis placed on one syllable in a word, making it louder and longer.' },
    { question: 'Which symbol represents the "th" sound in "think"?', options: ['/t/', '/θ/', '/f/', '/s/'], correct: 1, explanation: '/θ/ is the voiceless dental fricative, produced by placing the tongue between the teeth.' },
    { question: 'What is connected speech?', options: ['Speaking into a microphone', 'Words blending together in natural speech', 'Formal public speaking', 'Reading aloud'], correct: 1, explanation: 'Connected speech is how words naturally link together in fluent speech, including linking, elision, and assimilation.' },
  ],
};

export default function PracticeMCQ() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = selectedTopic ? quizData[selectedTopic] : [];
  const score = answers.filter((a, i) => a === questions[i]?.correct).length;

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    setAnswers([...answers, index]);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setSelectedTopic(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
    setQuizComplete(false);
  };

  const startQuiz = (topic) => {
    setSelectedTopic(topic);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers([]);
    setQuizComplete(false);
  };

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div>
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
          </div>
          <div className="container-custom py-20 lg:py-32 relative z-10">
            <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="text-4xl lg:text-5xl font-bold text-white mb-6 text-center">
              Quiz Complete!
            </motion.h1>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-custom max-w-2xl mx-auto text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="w-32 h-32 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <FiAward className="w-16 h-16 text-primary-600" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">{score} / {questions.length}</h2>
            <p className="text-gray-500 text-lg mb-4">Questions Correct</p>
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-1">
                <span>Your Score</span>
                <span className="font-semibold text-primary-600">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1 }} className={`h-4 rounded-full ${percentage >= 70 ? 'bg-green-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {percentage >= 80 ? 'Excellent! You have a strong understanding of this topic.' : percentage >= 60 ? 'Good job! Consider reviewing some concepts.' : 'Keep practicing! Review the material and try again.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={resetQuiz} className="btn-primary flex items-center gap-2">
                <FiRotateCw className="w-4 h-4" /> Try Another Topic
              </button>
              <button onClick={() => { setQuizComplete(false); setCurrentQuestion(0); setSelectedAnswer(null); setShowExplanation(false); setAnswers([]); }} className="border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all flex items-center gap-2">
                <FiRotateCw className="w-4 h-4" /> Retry Same Topic
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (selectedTopic) {
    const q = questions[currentQuestion];
    return (
      <div>
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
          </div>
          <div className="container-custom py-12 relative z-10">
            <div className="flex items-center justify-between">
              <button onClick={() => { setSelectedTopic(null); setCurrentQuestion(0); setSelectedAnswer(null); setShowExplanation(false); setAnswers([]); }} className="text-white/80 hover:text-white flex items-center gap-2 transition-colors">
                <FiArrowLeft className="w-4 h-4" /> Back to Topics
              </button>
              <span className="text-white/80 text-sm">Question {currentQuestion + 1} of {questions.length}</span>
            </div>
            <div className="mt-4 w-full bg-white/20 rounded-full h-2">
              <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} className="bg-accent h-2 rounded-full" />
            </div>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-custom max-w-3xl mx-auto">
            <motion.div key={currentQuestion} initial="hidden" animate="visible" variants={fadeUp}>
              <h2 className="text-2xl font-bold mb-8">{q.question}</h2>
              <div className="space-y-3">
                {q.options.map((option, i) => {
                  const isCorrect = i === q.correct;
                  const isSelected = i === selectedAnswer;
                  let optionClass = 'card p-4 cursor-pointer hover:border-primary-600 border-2 border-transparent transition-all';
                  if (showExplanation) {
                    if (isCorrect) optionClass = 'card p-4 border-2 border-green-500 bg-green-50 dark:bg-green-900/10';
                    else if (isSelected && !isCorrect) optionClass = 'card p-4 border-2 border-red-500 bg-red-50 dark:bg-red-900/10';
                    else optionClass = 'card p-4 border-2 border-transparent opacity-50';
                  }
                  return (
                    <div key={i} className={optionClass} onClick={() => handleAnswer(i)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${showExplanation && isCorrect ? 'bg-green-500 text-white' : showExplanation && isSelected ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600'}`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {showExplanation && isCorrect && <FiCheckCircle className="w-5 h-5 text-green-500" />}
                        {showExplanation && isSelected && !isCorrect && <FiX className="w-5 h-5 text-red-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>
              <AnimatePresence>
                {showExplanation && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-1">Explanation</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">{q.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {showExplanation && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex justify-end">
                  <button onClick={handleNext} className="btn-primary flex items-center gap-2">
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'} <FiArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container-custom py-20 lg:py-32 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl text-center mx-auto">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6">
              <FiTarget className="w-4 h-4 text-accent" />
              Test Your Knowledge
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Practice <span className="text-accent">MCQ</span> Quiz
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg mx-auto">
              Test your English skills with our multiple-choice quizzes. Choose a topic and challenge yourself with 5 carefully crafted questions.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title">
            Choose a Topic
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-subtitle">
            Select a category to test your knowledge
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicCategories.map((topic, i) => (
              <motion.div key={topic.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <button onClick={() => startQuiz(topic.id)} className="card p-6 w-full text-left hover:-translate-y-1 transition-all group">
                  <div className="text-4xl mb-3">{topic.icon}</div>
                  <h3 className="font-bold text-xl mb-1 group-hover:text-primary-600 transition-colors">{topic.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{topic.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">5 questions</span>
                    <span className="text-primary-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Start Quiz <FiArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <motion.h2 initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }} className="section-title">
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Choose Topic', desc: 'Pick a category that matches what you want to practice.' },
              { step: '02', title: 'Answer Questions', desc: 'Read each question carefully and select the best answer.' },
              { step: '03', title: 'Learn & Improve', desc: 'Review explanations and track your score to improve.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold">{item.step}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
