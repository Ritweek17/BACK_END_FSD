// 02_arrays_objects.js
// Practical 01: Node.js Fundamentals - Arrays, Objects, and Transformations

// 1. Objects and Destructuring
const student = {
    id: "STU123",
    name: "John Doe",
    course: "Backend Development",
    grades: {
        assignments: 85,
        midterm: 78,
        final: 92
    }
};

// Destructuring properties
const { name, course } = student;
const { assignments: assignmentGrade } = student.grades;

console.log(`Student: ${name} | Course: ${course}`);
console.log(`Assignment Grade: ${assignmentGrade}`);

// 2. Arrays and the Spread Syntax
const frontendModules = ["HTML", "CSS", "React"];
const backendModules = ["Node.js", "Express", "MongoDB"];

// Combining arrays using spread syntax
const fullStackModules = [...frontendModules, ...backendModules];
console.log("\nFull Stack Modules:", fullStackModules);

// 3. Array Transformations and Filtering
const scores = [45, 82, 33, 91, 76, 22, 100];

// Filter: Keep only passing scores (>= 40)
const passingScores = scores.filter(score => score >= 40);
console.log("\nPassing Scores:", passingScores);

// Map: Add 5 bonus points to passing scores
const boostedScores = passingScores.map(score => {
    const newScore = score + 5;
    return newScore > 100 ? 100 : newScore; // Cap at 100
});
console.log("Boosted Passing Scores:", boostedScores);
