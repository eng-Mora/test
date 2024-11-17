<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Exam Portal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
        }
        header {
            background-color: #34495e;
            color: white;
            padding: 10px 20px;
            text-align: center;
        }
        .container {
            margin: 20px auto;
            max-width: 800px;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        .input-field {
            width: 80%;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .btn {
            background-color: #2ecc71;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .btn:hover {
            background-color: #27ae60;
        }
    </style>
</head>
<body>
    <header>
        <h1>Student Exam Portal</h1>
    </header>
    <div id="login-page" class="container">
        <h2>Login</h2>
        <form id="login-form">
            <input type="text" id="username" class="input-field" placeholder="Enter your username (e.g., 2526)" required>
            <button type="submit" class="btn">Start Exam</button>
        </form>
    </div>

    <div id="exam-page" class="container" style="display: none;">
        <h2>Exam: Sample Test</h2>
        <p id="student-info"></p>
        <form id="exam-form">
            <!-- Question 1 -->
            <div class="question">
                <h3>1. What is the capital of France?</h3>
                <label>
                    <input type="radio" name="q1" value="Paris" required> Paris
                </label><br>
                <label>
                    <input type="radio" name="q1" value="London"> London
                </label><br>
                <label>
                    <input type="radio" name="q1" value="Rome"> Rome
                </label>
            </div>
            <!-- Question 2 -->
            <div class="question">
                <h3>2. What is 5 + 7?</h3>
                <label>
                    <input type="radio" name="q2" value="10" required> 10
                </label><br>
                <label>
                    <input type="radio" name="q2" value="12"> 12
                </label><br>
                <label>
                    <input type="radio" name="q2" value="14"> 14
                </label>
            </div>
            <!-- Submit Button -->
            <button type="submit" class="btn">Submit</button>
        </form>
    </div>

    <div id="results-page" class="container" style="display: none;">
        <h2>Exam Results</h2>
        <p id="results"></p>
    </div>

    <script>
        const loginForm = document.getElementById('login-form');
        const examForm = document.getElementById('exam-form');
        const loginPage = document.getElementById('login-page');
        const examPage = document.getElementById('exam-page');
        const resultsPage = document.getElementById('results-page');
        const studentInfo = document.getElementById('student-info');
        const results = document.getElementById('results');

        // Hardcoded username-to-name mapping
        const studentData = {
            "2526": "Amro",
            "1234": "Ali",
            "5678": "Sara"
        };

        // Correct answers
        const correctAnswers = {
            q1: "Paris",
            q2: "12"
        };

        // Logged-in users (to prevent re-login)
        const loggedInUsers = new Set();

        // Handle login form submission
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value.trim();

            // Check if username exists and is not already logged in
            if (studentData[username] && !loggedInUsers.has(username)) {
                loggedInUsers.add(username); // Mark user as logged in
                loginPage.style.display = 'none';
                examPage.style.display = 'block';
                studentInfo.textContent = `Username: ${username} | Student Name: ${studentData[username]}`;
            } else if (loggedInUsers.has(username)) {
                alert('This user has already taken the exam!');
            } else {
                alert('Invalid username! Please try again.');
            }
        });

        // Handle exam form submission
        examForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let score = 0;
            const formData = new FormData(examForm);

            // Check answers
            for (let [question, answer] of formData.entries()) {
                if (correctAnswers[question] === answer) {
                    score++;
                }
            }

            // Display results
            examPage.style.display = 'none';
            resultsPage.style.display = 'block';
            results.innerHTML = `
                <p>Your Score: ${score} / ${Object.keys(correctAnswers).length}</p>
                <p>Correct Answers:</p>
                <ul>
                    <li>Q1: ${correctAnswers.q1}</li>
                    <li>Q2: ${correctAnswers.q2}</li>
                </ul>
            `;
        });
    </script>
