
let currentQuestionIndex = 0; // Initialize the current question index
let currentScore = 0; // Initialize the score

async function fetchQuestion() {
    try {
        const response = await fetch(`http://localhost:5006/api/trivia/question/${currentQuestionIndex}`);
        if (!response.ok) throw new Error('Failed to load question');
        const data = await response.json();

        // Animate question fade-out and fade-in
        const questionElement = document.getElementById('question');
        questionElement.style.opacity = '0';
        setTimeout(() => {
            questionElement.innerText = data.text;
            questionElement.style.opacity = '1';
        }, 500);
    } catch (error) {
        console.error('Error fetching question:', error);
    }
}

async function submitAnswer() {
    const answer = document.getElementById('answerInput').value;
    try {
        const response = await fetch('http://localhost:5006/api/trivia/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionIndex: currentQuestionIndex, answer })
        });

        if (!response.ok) throw new Error('Failed to submit answer');

        const data = await response.json();
        currentScore = data.score; // Update the current score
        document.getElementById('score').innerText = `Score: ${currentScore}`;
        displayResult(data.message); // Display result on the page instead of using alert
        playSound(data.message === "Correct!"); // Play sound based on result

        if (data.message === "Correct!") {
            triggerConfetti(); // Trigger confetti if the answer is correct
        }

        // Increment the question index to load the next question
        currentQuestionIndex++;
        fetchQuestion(); // Fetch the next question
        document.getElementById('answerInput').value = ''; // Clear the input field
    } catch (error) {
        console.error('Error submitting answer:', error);
    }
}

// Function to play sound based on correct or wrong answer
function playSound(isCorrect) {
    const sound = document.getElementById(isCorrect ? 'correctSound' : 'wrongSound');
    sound.play();
}

// Function to trigger confetti celebration
function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Function to display result on the page (replaces the alert)
function displayResult(message) {
    const resultElement = document.createElement('p');
    resultElement.id = 'result';
    resultElement.innerText = message;
    resultElement.style.fontSize = '18px';
    resultElement.style.marginTop = '15px';

    // If result already exists, replace it; otherwise, add it
    const existingResult = document.getElementById('result');
    if (existingResult) {
        existingResult.replaceWith(resultElement);
    } else {
        document.getElementById('question-container').appendChild(resultElement);
    }
}

// Fetch the first question on page load
window.onload = fetchQuestion;

