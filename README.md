<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Exam Results</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #1a1a2e;
            color: #ffffff;
            text-align: center;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 95%;
            width: 100%;
            margin: 20px auto;
            background: #16213e;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        h1 {
            font-size: 2em;
            color: #00adb5;
            margin-bottom: 20px;
        }
        p {
            font-size: 1em;
            color: #bfc0c0;
            margin-bottom: 15px;
        }
        input[type="text"] {
            padding: 12px;
            width: 100%;
            font-size: 1em;
            background: #0f3460;
            border: 2px solid #00adb5;
            border-radius: 8px;
            color: #ffffff;
            margin-bottom: 15px;
            transition: all 0.3s ease;
        }
        input[type="text"]:focus {
            border-color: #ff2e63;
            outline: none;
            box-shadow: 0 0 10px rgba(255, 46, 99, 0.5);
        }
        button {
            padding: 10px 20px;
            background: #00adb5;
            color: #ffffff;
            font-size: 1em;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.2s;
            box-shadow: 0 6px 15px rgba(0, 173, 181, 0.3);
            width: 100%;
        }
        button:hover {
            background: #ff2e63;
            transform: translateY(-3px);
        }
        .result {
            margin-top: 20px;
            padding: 20px;
            background: #0f3460;
            border-radius: 10px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
        }
        .motivational {
            margin-top: 10px;
            font-size: 1.2em;
            color: #4ce1e6;
            font-weight: bold;
        }
        footer {
            margin-top: 20px;
            padding: 10px 0;
            color: #00adb5;
            font-size: 1em;
        }
    </style>
    <script>
        function getResult() {
            const code = document.getElementById("codeInput").value.trim();
            const resultDiv = document.getElementById("result");

            let name = "";
            let degree = "";
            let motivationalMessage = "";

switch (code) {
    case "2526":
        name = "Amro Mohamed";
        degree = "58+2=<span style='color:#ff2e63;'>60</span>/60";
        motivationalMessage = "Great job! You're on your way to amazing things!🤩";
            break;
    case "63855":
        name = "Abdelrahman Mahmoud";
        degree = "N/A";
        motivationalMessage = "Keep going, you're doing great!🤩";
        break;
    case "41715":
        name = "Ahmed Hossam";
        degree = "31+4=<span style='color:#ff2e63;'>35</span>/60";
        motivationalMessage = "Excellent work, stay motivated!🤩";
        break;
    case "73349":
        name = "Mahmoud Tawfik";
        degree = "30+4=<span style='color:#ff2e63;'>34</span>/60";
        motivationalMessage = "Well done, keep up the good work!🤩";
        break;
    case "69897":
        name = "Arwa Ahmed";
        degree = "36+4=<span style='color:#ff2e63;'>40</span>/60";
        motivationalMessage = "You're making progress, keep at it!🤩";
        break;
    case "80650":
        name = "Ahmed Ayman Raafat Mohamed";
        degree = "44+4=<span style='color:#ff2e63;'>48</span>/60";
        motivationalMessage = "Great effort, you're on track!🤩";
        break;
    case "52434":
        name = "Fares Ayman Saad";
        degree = "N/A";
        motivationalMessage = "Fantastic job, keep pushing forward!🤩";
        break;
    case "81463":
        name = "Ahmed Nagih Anwar";
        degree = "41+4=<span style='color:#ff2e63;'>45</span>/60";
        motivationalMessage = "Good job, you’re doing amazing!🤩";
        break;
    case "28411":
        name = "Raheeq Sayed Hassan";
        degree = "42+4=<span style='color:#ff2e63;'>46</span>/60";
        motivationalMessage = "Well done, keep believing in yourself!🤩";
        break;
    case "39472":
        name = "Mohamed Abdelazeem Al-Hefnawy";
        degree = "45+4=<span style='color:#ff2e63;'>49</span>/60";
        motivationalMessage = "Great job, keep striving!🤩";
        break;
    case "44889":
        name = "Mohamed Sleem";
        degree = "39+4=<span style='color:#ff2e63;'>34</span>/60";
        motivationalMessage = "Nice work, stay focused!🤩";
        break;
    case "92758":
        name = "Mazen Abdelwahab Ahmed";
        degree = "50+4=<span style='color:#ff2e63;'>54</span>/60";
        motivationalMessage = "You're doing amazing, keep it up!🤩";
        break;
    case "15032":
        name = "Tasneem Mohamed";
        degree = "41+4=<span style='color:#ff2e63;'>45</span>/60";
        motivationalMessage = "Good job, don’t stop now!🤩";
        break;
    case "72137":
        name = "Rodina Shewikh";
        degree = "44+4=<span style='color:#ff2e63;'>48</span>/60";
        motivationalMessage = "Awesome work, keep going!🤩";
        break;
    case "23069":
        name = "Youssef Hassan Mohamed";
        degree = "41+4=<span style='color:#ff2e63;'>45</span>/60";
        motivationalMessage = "You're doing amazing, stay positive!🤩";
        break;
    case "37144":
        name = "Abdullah Ahmed Salah";
        degree = "36+4=<span style='color:#ff2e63;'>40</span>/60";
        motivationalMessage = "Good job, keep working hard!🤩";
        break;
    case "44746":
        name = "Saeed";
        degree = "45+0=<span style='color:#ff2e63;'>45</span>/60";
        motivationalMessage = "Excellent, stay motivated!🤩";
        break;
    case "32532":
        name = "Mariam Atef";
        degree = "33+4=<span style='color:#ff2e63;'>37</span>/60";
        motivationalMessage = "Great effort, keep pushing!🤩";
        break;
    case "18054":
        name = "Haneen Elsayed Suleiman";
        degree = "N/A";
        motivationalMessage = "Good work, keep moving forward!🤩";
        break;
    case "49696":
        name = "Adam";
        degree = "41+4=<span style='color:#ff2e63;'>45</span>/60";
        motivationalMessage = "Keep going, you're doing great!🤩";
        break;
    case "48261":
        name = "Zeyad Ahmed Youssef";
        degree = "31+4=<span style='color:#ff2e63;'>35</span>/60";
        motivationalMessage = "Excellent work, stay strong!🤩";
        break;
    case "81659":
        name = "Nour Abdulrahman";
        degree = "42+4=<span style='color:#ff2e63;'>46</span>/60";
        motivationalMessage = "You're making progress, keep it up!🤩";
        break;
    case "95731":
        name = "Rodina Mohamed Nasr";
        degree = "34+4=<span style='color:#ff2e63;'>38</span>/60";
        motivationalMessage = "Great effort, keep going!🤩";
        break;
    case "10781":
        name = "Yasmin Elsayed";
        degree = "N/A";
        motivationalMessage = "Good job, keep believing!🤩";
        break;
    case "21687":
        name = "Rowan Ehab";
        degree = "33+4=<span style='color:#ff2e63;'>37</span>/60";
        motivationalMessage = "Keep up the great work!🤩";
        break;
    case "80456":
        name = "Mazen Ahmed Samir";
        degree = "44+4=<span style='color:#ff2e63;'>48</span>/60";
        motivationalMessage = "You're doing well, keep it up!🤩";
        break;
    case "16840":
        name = "Sama Ibrahim";
        degree = "39+4=<span style='color:#ff2e63;'>43</span>/60";
        motivationalMessage = "Excellent progress, stay strong!🤩";
        break;
    case "56302":
        name = "Yassin Mohamed Osama";
        degree = "N/A";
        motivationalMessage = "Keep going, you're doing great!🤩";
        break;
    case "52182":
        name = "Omar Walid Gamal";
        degree = "52+4=<span style='color:#ff2e63;'>56</span>/60";
        motivationalMessage = "Good effort, stay motivated!🤩";
        break;
    case "85459":
        name = "Youssef Mohamed Abdel Fattah";
        degree = "45+4=<span style='color:#ff2e63;'>49</span>/60";
        motivationalMessage = "You're making great progress, keep it up!🤩";
        break;
    case "94257":
        name = "Arwa Mostafa";
        degree = "N/A";
        motivationalMessage = "Fantastic work, keep believing in yourself!🤩";
        break;
    case "41596":
        name = "Nour Eldeen";
        degree = "56+4=<span style='color:#ff2e63;'>60</span>/60";
        motivationalMessage = "Excellent work, stay focused!🤩";
        break;
    case "94452":
        name = "Donia";
        degree = "N/A";
        motivationalMessage = "Keep it up, you're doing great!🤩";
        break;
    case "37486":
        name = "Habiba Mohamed";
        degree = "36+4=<span style='color:#ff2e63;'>40</span>/60";
        motivationalMessage = "Great job, keep pushing forward!🤩";
        break;
    case "23849":
        name = "Farah Emad";
        degree = "35+4=<span style='color:#ff2e63;'>39</span>/60";
        motivationalMessage = "Well done, stay confident!🤩";
        break;
    case "73057":
        name = "Omar Hany";
        degree = "50+4=<span style='color:#ff2e63;'>54</span>/60";
        motivationalMessage = "Good work, keep striving!🤩";
        break;
    case "06764":
        name = "Zainab Mohamed Ali";
        degree = "30+4=<span style='color:#ff2e63;'>34</span>/60";
        motivationalMessage = "Amazing progress, don't stop now!🤩";
        break;
    case "15290":
        name = "Mohamed Amr";
        degree = "30+4=<span style='color:#ff2e63;'>34</span>/60";
        motivationalMessage = "You're doing great, stay determined!🤩";
        break;
    case "39639":
        name = "Eman Mohamed Ali";
        degree = "38+4=<span style='color:#ff2e63;'>42</span>/60";
        motivationalMessage = "Fantastic effort, keep going!🤩";
        break;
    case "69756":
        name = "Ahmed Yasser Abosrea";
        degree = "N/A";
        motivationalMessage = "Keep pushing, you're doing amazing!🤩";
        break;
    case "29474":
        name = "Mohamed Ehab Abdel Fattah Ahmed";
        degree = "31+4=<span style='color:#ff2e63;'>35</span>/60";
        motivationalMessage = "Great job, stay motivated!🤩";
        break;
    case "48389":
        name = "Sondos Salah";
        degree = "40+4=<span style='color:#ff2e63;'>44</span>/60";
        motivationalMessage = "Excellent work, keep believing in yourself!🤩";
        break;
    case "66908":
        name = "Ahmed Mohammed Abdullatif";
        degree = "N/A";
        motivationalMessage = "Awesome effort, keep going!🤩";
        break;
    case "22030":
        name = "Habiba Ahmed Abdelraouf Mostafa";
        degree = "35+4=<span style='color:#ff2e63;'>39</span>/60";
        motivationalMessage = "Well done, you're doing amazing!🤩";
        break;
    case "68450":
        name = "Malak Ashraf";
        degree = "N/A";
        motivationalMessage = "Keep it up, you're doing great!🤩";
        break;
    case "25695":
        name = "Vera Essam Adly";
        degree = "21+4=<span style='color:#ff2e63;'>25</span>/60";
        motivationalMessage = "Great job, stay strong!🤩";
        break;
    case "80135":
        name = "Mohamed Ashraf Abdelaleem";
        degree = "N/A";
        motivationalMessage = "Excellent effort, keep going!🤩";
        break;
    case "75934":
        name = "Daai Abdelaleem Mohamed";
        degree = "30+4=<span style='color:#ff2e63;'>34</span>/60";
        motivationalMessage = "Fantastic work, keep moving forward!🤩";
        break;
    case "19734":
        name = "Kareem Elyamany";
        degree = "N/A";
        motivationalMessage = "Good job, keep believing in yourself!🤩";
        break;
    case "92758":
        name = "Mazen Abdelwahab Ahmed";
        degree = "50+4=<span style='color:#ff2e63;'>54</span>/60";
        motivationalMessage = "You're doing amazing, keep it up!🤩";
        break;
    case "04596":
        name = "Ahmed Sameh Saeed";
        degree = "21+4=<span style='color:#ff2e63;'>25</span>/60";
        motivationalMessage = "Great job, stay on track!🤩";
        break;
    case "41729":
        name = "Moamen Ehab";
        degree = "30+4=<span style='color:#ff2e63;'>34</span>/60";
        motivationalMessage = "Keep striving, you're doing great!🤩";
        break;
    case "19153":
        name = "Shahd Saeed";
        degree = "45+4=<span style='color:#ff2e63;'>49</span>/60";
        motivationalMessage = "Keep pushing forward, you're doing well!🤩";
        break;
    case "08724":
        name = "Abdelwahab Abdulrahman";
        degree = "34+4=<span style='color:#ff2e63;'>38</span>/60";
        motivationalMessage = "Great work, stay motivated!🤩";
        break;
    case "30693":
        name = "Rahma";
        degree = "31+0=<span style='color:#ff2e63;'>31</span>/60";
        motivationalMessage = "Awesome effort, keep pushing forward!🤩";
        break;
    case "35804":
        name = "Reem Khaled Elmorsy";
        degree = "50+4=<span style='color:#ff2e63;'>54</span>/60";
        motivationalMessage = "Good job, stay confident!🤩";
        break;
    case "50808":
        name = "Ahmed Hussein";
        degree = "50+0=<span style='color:#ff2e63;'>50</span>/60";
        motivationalMessage = "Fantastic progress, keep going!🤩";
        break;
    case "20531":
        name = "Sandy Essam";
        degree = "39+4=<span style='color:#ff2e63;'>43</span>/60";
        motivationalMessage = "You're doing great, stay focused!🤩";
        break;
    case "20321":
        name = "Basant Mohamed";
        degree = "21+4=<span style='color:#ff2e63;'>25</span>/60";
        motivationalMessage = "Keep it up, you're making progress!🤩";
        break;
    case "70126":
        name = "Mazen Mohamed";
        degree = "42+0=<span style='color:#ff2e63;'>42</span>/60";
        motivationalMessage = "Keep it up, you're making progress!🤩";
        break        
    default:
        name = "Unknown";
        degree = "N/A";
        motivationalMessage = "Keep going, you’ve got this!🤩";
}
        
        

            resultDiv.innerHTML = `
                <div class="result">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Degree in Exam:</strong> ${degree}</p>
                    <p class="motivational">${motivationalMessage}</p>
                </div>
            `;
        }
    </script>
</head>
<body>
    <div class="container">
        <h1>Exam Results Checker</h1>
        <p>Enter your code to see your exam results:</p>
        <input type="text" id="codeInput" placeholder="Enter your code here">
        <br>
        <button onclick="getResult()">Check Result</button>
        <div id="result"></div>
    </div>
    <footer>
        Developed by Eng: Amr Mohamed
    </footer>
