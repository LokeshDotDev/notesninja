/**
 * DESCRIPTION FORMAT GUIDE
 * 
 * When creating product descriptions, use the following formats:
 * 
 * 1. BULLET POINTS WITH EMOJIS (Recommended):
 *    📘 Advanced retail notes
 *    🛍 Retail strategy frameworks
 *    📝 Exam-pattern-based mock papers
 *    📊 Case-based retail insights
 *    ⏱️ Quick revision-friendly format
 * 
 * 2. REGULAR BULLET POINTS:
 *    - Point one
 *    - Point two
 *    • Point three
 *    * Point four
 * 
 * 3. CHECKMARKS:
 *    ✔ 100% syllabus aligned
 *    ✔ Instant downloadable PDFs
 *    ✔ Useful for exams & assignments
 * 
 * 4. SECTIONS WITH HEADERS (use plain text that ENDS WITH COLON or IS ALL CAPS):
 *    What You Get:
 *    📘 Advanced retail notes
 *    🛍 Retail strategy frameworks
 *    
 *    Ideal For:
 *    - Retail specialization students
 *    - Internal assessments & end-term exams
 *    - Strategic retail management preparation
 * 
 * 5. MIX EVERYTHING:
 *    This product is created exclusively for MBA SEM 4 students...
 *    
 *    What You Get:
 *    📘 Advanced retail notes
 *    🛍 Retail strategy frameworks
 *    📝 Exam-pattern-based mock papers
 *    
 *    Ideal For:
 *    - Retail specialization students
 *    - Internal assessments
 *    
 *    Benefits:
 *    ✔ 100% syllabus aligned
 *    ✔ Instant downloadable PDFs
 * 
 * IMPORTANT:
 * - Use \n (newline) to separate items
 * - Each item should be on its own line
 * - Emojis should be at the start of the line
 * - The parser will automatically format them correctly on the frontend
 * 
 * EXAMPLE FROM YOUR DESCRIPTION:
 * 
 * This product is created exclusively for MBA SEM 4 students of Online Manipal University who have chosen Retail Management as their specialization. The study material focuses on advanced retail strategy, omnichannel management, retail analytics, and strategic merchandising.
 * What You Get:
 * 📘 Advanced retail notes
 * 🛍 Retail strategy frameworks
 * 📝 Exam-pattern-based mock papers
 * 📊 Case-based retail insights
 * ⏱️ Quick revision-friendly format
 * Ideal For:
 * - Retail specialization students
 * - Internal assessments & end-term exams
 * - Strategic retail management preparation
 * ✔ 100% syllabus aligned
 * ✔ Instant downloadable PDFs
 * ✔ Useful for exams & assignments
 * 
 * This will display as:
 * - Intro paragraph
 * - "What You Get:" as a bold heading
 * - Bullet points with emojis
 * - "Ideal For:" as a bold heading
 * - Regular bullet points
 * - Checkmark bullet points
 */

// Example test data for testing the parser
export const testDescriptions = {
  mba_retail: `This product is created exclusively for MBA SEM 4 students of Online Manipal University who have chosen Retail Management as their specialization. The study material focuses on advanced retail strategy, omnichannel management, retail analytics, and strategic merchandising.
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
✔ Useful for exams & assignments`,

  simple_bullets: `- Complete coverage of advanced topics
- Includes solved examples
- Practice questions included
✔ Verified by experts`,

  with_checkmarks: `🎓 University-level content
📚 Comprehensive study material
✔ 100% plagiarism-free
✔ Instant access
✔ Lifetime validity`,
};
