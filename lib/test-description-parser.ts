import { parseDescription } from '@/lib/description-parser';

// Test the parser with the exact description you provided
const testDescription = `This product is created exclusively for MBA SEM 4 students of Online Manipal University who have chosen Retail Management as their specialization. The study material focuses on advanced retail strategy, omnichannel management, retail analytics, and strategic merchandising. What You Get: 📘 Advanced retail notes 🛍 Retail strategy frameworks 📝 Exam-pattern-based mock papers 📊 Case-based retail insights ⏱️ Quick revision-friendly format Ideal For: Retail specialization students Internal assessments & end-term exams Strategic retail management preparation ✔ 100% syllabus aligned ✔ Instant downloadable PDFs ✔ Useful for exams & assignments`;

const testDescription2 = `This product is created exclusively for MBA SEM 4 students of Online Manipal University who have chosen Retail Management as their specialization. The study material focuses on advanced retail strategy, omnichannel management, retail analytics, and strategic merchandising.
What You Get:
📘 Advanced retail notes
🛍 Retail strategy frameworks
📝 Exam-pattern-based mock papers
📊 Case-based retail insights
⏱️ Quick revision-friendly format
Ideal For:
- Retail specialization students
- Internal assessments & end-term exams
- Strategic retail management preparation
✔ 100% syllabus aligned
✔ Instant downloadable PDFs
✔ Useful for exams & assignments`;

console.log('Test 1 - No line breaks (current format):');
console.log(parseDescription(testDescription));

console.log('\n\nTest 2 - With line breaks (recommended format):');
console.log(parseDescription(testDescription2));
