<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Educational Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ecf0f1;
        }
        header {
            background-color: #8B008B;
            color: white;
            padding: 20px;
            text-align: center;
        }
        nav {
            background-color: #580058;
            padding: 10px;
        }
        nav ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
        }
        nav ul li {
            margin: 0 15px;
        }
        nav ul li a {
            color: white;
            text-decoration: none;
            font-weight: bold;
        }
        .menu-content {
            background-color: #34495e;
            color: white;
            padding: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }
        main {
            padding: 20px;
        }
        .video-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
        }
        .video-container h2 {
            color: #2c3e50;
        }
        .wistia_embed {
            width: 80%;
            max-width: 800px;
            margin-bottom: 20px;
        }
        .login-container {
            background-color: #ffffff;
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 360px;
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: block;
        }
        .login-container.active {
            display: block;
        }
        h1 {
            margin-bottom: 1.5rem;
            font-size: 2rem;
            color: #333;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #555;
        }
        input {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 1rem;
            color: #333;
        }
        button {
            width: 100%;
            padding: 0.75rem;
            background-color: #009688;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: bold;
        }
        button:hover {
            background-color: #00796b;
        }
        .error {
            color: red;
            margin-top: 1rem;
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <header id="header">
        <h1>Welcome to the Process Website</h1>
    </header>
    
    <nav id="nav">
        <ul>
           <li><a href="https://eng-mora.github.io/The_Process/" target="_blank">Home</a></li>
           <li><a href="#videos">Videos</a></li>
           <li><a href="https://linktr.ee/the_process_Eng.tarek" target="_blank">Contact</a></li>
        </ul>
    </nav>
    
    <main id="main" style="display:none;">
        <section id="home">
            <h2>About Our the Process Platform</h2>
            <p>This website is dedicated to providing high-quality educational content through videos and other resources.</p>
        </section>
        
        <section id="videos" class="video-container">
            <h2 class="video-title" id="video1-title">شرح حصة 3 عربي (part1)</h2>
            <div class="video" id="video1" style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
                <iframe src="https://drive.google.com/file/d/1-VIltXMBLLQNwbVbwhTHO2ovmYSsT0wU/preview" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media;"></iframe>
            </div>
            <h2 class="video-title" id="video2-title">شرح حصة 3 عربي (part2)</h2>
            <div class="video" id="video2" style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
                <iframe src="https://drive.google.com/file/d/15Mo7htyDhT7f9Beu9TwCiIMuxGO-dNRc/preview" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media;"></iframe>
            </div>
            <h2 class="video-title hidden" id="video3-title">شرح حصة 3 لغات (part1)</h2>
            <div class="video hidden" id="video3" style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
                <iframe src="https://drive.google.com/file/d/1K23MDswnSetWJRpvkhgbdzAF9HEp6syq/preview" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media;"></iframe>
            </div>
            <h2 class="video-title hidden" id="video4-title">شرح حصة 3 لغات (part2)</h2>
            <div class="video hidden" id="video4" style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
                <iframe src="https://drive.google.com/file/d/1f0f8Q3hTneh5tnT1piVaIe4xE8EceBHg/preview" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media;"></iframe>
            </div>
            <h2 class="video-title" id="video5-title">اه يا زمن</h2>
            <div class="video" id="video5" style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 55.9375%;">
                <iframe src="https://fast.wistia.net/embed/iframe/iu5pz1rqv3" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media;"></iframe>
            </div>
        </section>
        
        <section id="contact">
            <h2>Contact Us</h2>
            <p>If you have any questions or need further information, feel free to contact us at <a href="mailto:info@educationwebsite.com">mamrro8529@gmail.com</a>.</p>
            <p>Developed by Eng: Amr Mohamed</p>
        </section>
    </main>

    <div class="login-container" id="loginContainer">
    <img src="https://i.ibb.co/nmgZDmT/Whats-App-Image-2024-09-04-at-15-05-46-removebg-preview.png" alt="Login Image" style="width: 60%; max-width: 300px; margin-bottom: 20px;">
    <h1>Login to The Process platform</h1>
    <form id="loginForm">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required>
        
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>
        
        <button type="submit">Login</button>
        <div id="errorMessage" class="error"></div>
    </form>
</div>


    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const loginContainer = document.getElementById('loginContainer');
            const mainContent = document.getElementById('main');
            const header = document.getElementById('header');
            const nav = document.getElementById('nav');
            const videos = document.querySelectorAll('.video');
            const videoTitles = document.querySelectorAll('.video-title');

            function showLogin() {
                loginContainer.style.display = 'block';
                mainContent.style.display = 'none';
                header.style.display = 'none';
                nav.style.display = 'none';
            }

            function showMainContent() {
                loginContainer.style.display = 'none';
                mainContent.style.display = 'block';
                header.style.display = 'block';
                nav.style.display = 'block';
            }

            function showVideosForUser(user) {
                videos.forEach(video => video.classList.add('hidden'));
                videoTitles.forEach(title => title.classList.add('hidden'));

                if (user === '45455') {
                    document.getElementById('video1').classList.remove('hidden');
                    document.getElementById('video2').classList.remove('hidden');
                    document.getElementById('video1-title').classList.remove('hidden');
                    document.getElementById('video2-title').classList.remove('hidden');
                  }
                  
                  if (user === '45454') {
                    document.getElementById('video1').classList.remove('hidden');
                    document.getElementById('video2').classList.remove('hidden');
                    document.getElementById('video3').classList.remove('hidden');
                    document.getElementById('video4').classList.remove('hidden');
                    document.getElementById('video5').classList.remove('hidden');

                    document.getElementById('video1-title').classList.remove('hidden');
                    document.getElementById('video2-title').classList.remove('hidden');
                    document.getElementById('video3-title').classList.remove('hidden');
                    document.getElementById('video4-title').classList.remove('hidden');
                    document.getElementById('video5-title').classList.remove('hidden');


                } else {
                    // Handle other users if needed
                }
            }

            document.getElementById('loginForm').addEventListener('submit', function(event) {
                event.preventDefault();

                var username = document.getElementById('username').value;
                var password = document.getElementById('password').value;
                var errorMessage = document.getElementById('errorMessage');

                // Updated user validation
                if ((username === '45454' && password === '45454') ||
                    (username === '45455' && password === '45455')) {
                    showMainContent();
                    showVideosForUser(username);
                } else {
                    errorMessage.textContent = 'Invalid username or password';
                }
            });

            showLogin();
        });
    </script>

