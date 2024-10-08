<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تصحيح الامتحانات</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            direction: rtl;
            text-align: center;
            margin: 20px;
        }
        input {
            margin: 5px;
            padding: 5px;
            width: 50px;
            text-align: center;
        }
        .result {
            margin-top: 20px;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <h1>نموذج تصحيح الامتحان</h1>
    <form id="examForm">
        <div id="questions">
            <!-- سيتم إنشاء الأسئلة هنا عبر JavaScript -->
        </div>
        <button type="button" onclick="checkAnswers()">تحقق من الإجابات</button>
    </form>

    <div class="result" id="result"></div>

    <script>
        const correctAnswers = ['ا', 'ب', 'ا', 'ا', 'ج', 'ب', 'ج', 'د', 'د', 'ب', 'ا', 'ا', 'ا', 'ج', 'د', 'ج', 'ج', 'د', 'د', 'د', 'ب', 'ا', 'ج', 'ب', 'ا', 'د', 'ب', 'ج', 'ب', 'ا', 'ب', 'ب', 'ب', 'ب', 'ب', 'ا', 'ب', 'ب', 'ب', 'ج', 'د', 'ا'];

        // إنشاء الحقول للإجابات
        const questionsDiv = document.getElementById("questions");
        for (let i = 0; i < correctAnswers.length; i++) {
            let questionHtml = `
                <div>
                    <label for="q${i+1}">السؤال ${i+1}:</label>
                    <input type="text" id="q${i+1}" maxlength="1">
                </div>
            `;
            questionsDiv.innerHTML += questionHtml;
        }

        // التحقق من الإجابات
        function checkAnswers() {
            let resultDiv = document.getElementById("result");
            resultDiv.innerHTML = ''; // مسح النتائج السابقة
            let userAnswers = [];
            let errors = [];

            // جمع إجابات المستخدم
            for (let i = 0; i < correctAnswers.length; i++) {
                let userAnswer = document.getElementById(`q${i+1}`).value.toLowerCase();
                userAnswers.push(userAnswer);
                if (userAnswer !== correctAnswers[i]) {
                    errors.push(`السؤال ${i+1}: الإجابة الصحيحة هي (${correctAnswers[i]})`);
                }
            }

            // عرض النتائج
            if (errors.length > 0) {
                resultDiv.innerHTML = `<p>لقد أخطأت في ${errors.length} سؤال/أسئلة:</p>`;
                resultDiv.innerHTML += `<ul>`;
                errors.forEach(error => {
                    resultDiv.innerHTML += `<li>${error}</li>`;
                });
                resultDiv.innerHTML += `</ul>`;
            } else {
                resultDiv.innerHTML = `<p>كل الإجابات صحيحة! أحسنت!</p>`;
            }
        }
    </script>


