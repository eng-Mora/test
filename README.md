<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login and Video Page</title>
    <style>
        /* General styles */
        body {
  
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #302967; /* Updated background color */
    margin: 0;
    transition: background-color 0.5s, color 0.5s;
    overflow: hidden; /* Prevent scrolling on the body */
}
{
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f0f0f0;
        margin: 0;
        transition: background-color 0.5s, color 0.5s;
        overflow: hidden; /* Prevent scrolling on the body */
    }

    .container {
        background-color: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        text-align: center;
        width: 100%;
        max-width: 1000px;
        transition: background-color 0.5s, color 0.5s;
        overflow-y: auto; /* Enable vertical scrolling */
        max-height: 90vh; /* Limit the height to fit in the viewport */
    }

    .container img {
        width: 160px;
        height: auto;
        margin-bottom: 10px;
        background-color: #fff;
        padding: 10px;
        border-radius: 8px;
    }

    .container h2, .container h1 {
        margin-bottom: 20px;
    }

    .container input {
        width: 100%;
        padding: 12px;
        margin: 12px 0;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    .container button {
        width: 100%;
        padding: 12px;
        background-color: #9f54d9;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: background-color 0.3s, transform 0.3s;
    }

    .container button:before,
    .container button:after,
    .container button .button_reflection-1,
    .container button .button_reflection-2,
    .container button .button_circle-2 {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;
    }

    .container button:before {
        left: -120%;
        transform: skewX(-30deg);
    }

    .container button:after {
        left: 100%;
        transform: skewX(30deg);
    }

    .container button:hover:before {
        left: 100%;
    }

    .container button:hover:after {
        left: -100%;
    }

    .container button:hover {
        transform: rotate(-4deg) scale(1.1);
    }

    .container button .button_reflection-1 {
        left: 120%;
    }

    .container button .button_reflection-2 {
        left: -70%;
    }

    .container button:hover .button_circle-2 {
        transform: translate(-20px, 20px) scale(1.1);
    }

    .container button.button_diamond:hover {
        transform: translateY(7px) rotate(-24deg) scale(1.1);
    }

    .hidden {
        display: none;
    }

    .icon {
        width: 50px;
        height: 50px;
        cursor: pointer;
        margin-top: 20px;
    }

    .footer-text {
        margin-top: 20px;
        font-size: 16px;
        color: #888;
    }

    .contact-icons {
        margin-top: 10px;
    }

    .contact-icons a {
        display: inline-block;
        margin: 0 10px;
    }

    .contact-icons img {
        width: 30px;
        height: 30px;
    }

    .contact-message {
        font-size: 18px;
        color: black;
        margin-bottom: 10px;
    }

    body.dark-mode .contact-message {
        color: #f0f0f0;
    }

    body.dark-mode {
        background-color: #2c2c2c;
        color: #f0f0f0;
    }

    body.dark-mode .container {
        background-color: #3c3c3c;
        color: #f0f0f0;
    }

    body.dark-mode .container img {
        background-color: #3c3c3c;
    }

    body.dark-mode input {
        background-color: #5c5c5c;
        color: #f0f0f0;
        border: 1px solid #7c7c7c;
    }

    body.dark-mode .container button {
        background-color: #8c4aad;
    }

    body.dark-mode .container button:hover {
        background-color: #9f54d9;
    }

    .video-container {
        padding: 10px 0;
        position: relative;
        margin-bottom: 15px;
        text-align: center;
        max-height: 70vh; /* Limit the height to fit in the viewport */
        overflow: auto; /* Enable scrolling if content overflows */
    }

    .video-title {
        font-size: 17px;
        margin-bottom: 10px;
    }

    .video-container iframe {
        border-radius: 8px;
        width: 100%;
        height: auto;
        max-height: 100%;
    }

    .video-footer-text {
        margin-top: 5px;
        font-size: 16px;
        color: #888;
    }

    body.dark-mode .video-footer-text {
        color: #f0f0f0;
    }

    .theme-switch-wrapper {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        align-items: center;
    }

    .theme-switch {
        display: none;
    }

    .theme-switch-label {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .theme-switch-label .sun-icon,
    .theme-switch-label .moon-icon {
        font-size: 24px;
        transition: opacity 0.5s;
    }

    .theme-switch:checked + .theme-switch-label .sun-icon {
        opacity: 0;
    }

    .theme-switch:not(:checked) + .theme-switch-label .moon-icon {
        opacity: 0;
    }

    .menu-content {
    background-color: #2c2c2c;
    color: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 200px; /* Set the maximum height of the menu */
    overflow-y: auto;  /* Enable vertical scrolling */
}


    .menu-button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 4px;
        margin-bottom: 20px;
    }

    .menu-button:hover {
        background-color: #45a049;
    }

    .menu-content ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .menu-content ul li {
        padding: 10px 15px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .menu-content ul li:hover {
        background-color: #444;
        border-radius: 4px;
    }

    .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding: 10px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    body.dark-mode .user-info {
        background-color: #444;
    }

    .user-info img {
        border-radius: 50%;
        width: 50px;
        height: 50px;
        margin-right: 15px;
    }

    .user-info p {
        margin: 0;
        font-size: 16px;
        font-weight: bold;
    }
    </style>
</head>
<body>
    <div class="container" id="login-container">
        <img src="https://i.ibb.co/G2dH87P/Clipped-image-20240718-232638.png" alt="Medal Image">
        <h2>The Process platform</h2>
        <input type="password" id="username" placeholder="Enter Username" onkeydown="handleEnterKey(event)">
        <button onclick="login()">Login</button>
        <p class="contact-message">لو واجهتك مشكلة ابعتلي</p>
        <div class="contact-icons">
            <a href="https://www.facebook.com/mamro8529?mibextid=ZbWKwL" title="Facebook">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook Icon">
            </a>
            <a href="https://wa.me/message/5LRM2DVHPZQFM1" target="_blank" title="WhatsApp">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Icon">
            </a>
            <a href="http://t.me/Mora_mo1" target="_blank" title="Telegram">
                <img src="https://i.ibb.co/9TGmH7c/cropped-image.png" alt="Telegram Icon">
            </a>
        </div>
        <p class="footer-text">Developed by Eng: Amr Mohamed</p>
    </div>

    <div class="container hidden" id="video-container">
        <div class="user-info">
            <img id="user-icon" src="" alt="User Icon">
            <p id="user-name">Username</p>
        </div>
        <img src="https://i.ibb.co/G2dH87P/Clipped-image-20240718-232638.png" alt="Medal Image" class="medallion">
        <h2 id="video-heading">The Process platform</h2>
        <button class="menu-button" onclick="document.getElementById('video-menu').classList.toggle('hidden')">Select Video</button>
<div id="video-menu" class="menu-content hidden">
    <ul>
        <li onclick="showVideo('video1')">حصة التأهيل</li>
        <li onclick="showVideo('video2')">حل واجب حصة 1</li>
        <li onclick="showVideo('video4')">باقي حل اسئلة حصة 2</li>
        <li onclick="showVideo('video3')">حل واجب حصة 2</li>
    </ul>
</div>

        <div id="video1" class="video-container hidden">
    <h1 class="video-title">حصة التأهيل</h1>
    <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
        <iframe src="https://drive.google.com/file/d/1mwmNKYtvwn318OhJEIC6nFOHnaOCr1ne/preview" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media;"></iframe>
    </div>
       
        </div>
        <div id="video2" class="video-container hidden">
    <h1 class="video-title">حل واجب حصة 1 </h1>
    <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://drive.google.com/file/d/1k03hdmxGtL6Vfd9O-cxuywaVrINwdJJp/preview" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media;"></iframe>
    </div>
    
<iframe src="https://drive.google.com/file/d/1G3Oq-lDSpLcnaCRyLgd7x0CcamC-rjBY/preview" width="640" height="480" allow="autoplay"></iframe>
</div>
<div id="video3" class="video-container hidden">
    <h1 class="video-title">حل واجب حصة 2</h1>
    
    
    <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://drive.google.com/file/d/1Y0s1hTTgV-8drqiN_05yVOM6NiKvb2x2/preview" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media;"></iframe></div>
    
<iframe src="https://drive.google.com/file/d/1HdGZJTZ4SDURmuIaEZyMLqLrzNuvpqPP/preview" width="640" height="480" allow="autoplay"></iframe>
  </div>

<div id="video4" class="video-container hidden">
    <h1 class="video-title">باقي حل اسئلة حصة 2</h1>
<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe src="https://drive.google.com/file/d/1Awo0t3OaoAwpESJCJG56MED6dZEXrsZ7/preview" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media;"></iframe></div>


  </div>
        <p class="contact-message">لو واجهتك مشكلة ابعتلي</p>
        <div class="contact-icons">
            <a href="https://www.facebook.com/mamro8529?mibextid=ZbWKwL" title="Facebook">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook Icon">
            </a>
            <a href="https://wa.me/message/5LRM2DVHPZQFM1" target="_blank" title="WhatsApp">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Icon">
            </a>
            <a href="http://t.me/Mora_mo1" target="_blank" title="Telegram">
                <img src="https://i.ibb.co/9TGmH7c/cropped-image.png" alt="Telegram Icon">
            </a>
        </div>
        <p class="video-footer-text">Developed by Eng: Amr Mohamed</p>
    </div>

    <div class="theme-switch-wrapper">
        <input type="checkbox" id="theme-switch" class="theme-switch">
        <label class="theme-switch-label" for="theme-switch">
            <span class="moon-icon">🌚</span>
            <span class="sun-icon">🌞</span>
        </label>
    </div>

    <script>
        const userDetails = {
            'admin': { name: 'administrator', icon: 'https://i.ibb.co/7KQqmM3/download.png '},
            
            '48261': { name: 'زياد احمد يوسف', icon: 'https://api.multiavatar.com/12ac8e37b20a4556f1.svg'},
            '75934': { name: 'جنى عبدالعليم', icon: 'https://api.multiavatar.com/54c54768ceb0c3f83a.svg'},
            '21687': { name: 'روان إيهاب', icon: 'https://api.multiavatar.com/155a84d30e3e3cca7e.svg'},
            '39472': { name: 'محمد عبدالعظيم', icon: 'https://api.multiavatar.com/147b5eefb657e22dc2.svg'},
            '58210': { name: 'سلمى وائل', icon: 'https://api.multiavatar.com/95bf4a24efb7c2748c.svg'},
            '70493': { name: 'فيروز محمد', icon: 'https://api.multiavatar.com/59e284ef4c6c59b44b.svg'},
            '13856': { name: 'نورهان محمد', icon: 'https://api.multiavatar.com/d6698e2ee87a543c08.svg'},
            '94720': { name: 'سندس محمد', icon: 'https://api.multiavatar.com/19b4a93ea61f0b650e.svg'},
            '58391': { name: 'ملك محمد', icon: 'https://api.multiavatar.com/2422f12d6e1bb1d40b.svg'},
            '62047': { name: 'منه الله جمال', icon: 'https://api.multiavatar.com/12de69a625c83e5ca8.svg'},
            '86284': { name: 'حبيبية شعبان', icon: 'https://api.multiavatar.com/1eae35ecc479f6edd1.svg'},
            '49696': { name: 'ادم عمرو', icon: 'https://api.multiavatar.com/f84f24bcc7b72eebf0.svg' },
            '81659': { name: 'نور عبدالرحمن', icon: 'https://api.multiavatar.com/20ba7ccc9a755d9743.svg' },
            '10781': { name: 'ياسمين السيد', icon: 'https://api.multiavatar.com/2422f12d6e1bb1d40b.svg' },
            '44889': { name: 'محمد سليم', icon: 'https://api.multiavatar.com/94a0dd6577ca3c7291.svg' },
            '39639': { name: 'ايمان محمد ', icon: 'https://api.multiavatar.com/e736fdd76d2f8bb555.svg' },
            '29474': { name: 'محمد ايهاب عبد الفتاح ', icon: 'https://api.multiavatar.com/7995823da6025e8a33.svg' },
            '86074': { name: 'نيفين حمدي محمد', icon: 'https://api.multiavatar.com/12de69a625c83e5ca8.svg' },
            '30693': { name: 'رحمه ماجد', icon: 'https://api.multiavatar.com/1eae35ecc479f6edd1.svg' },
            '99'   : { name: 'teto', icon: 'https://api.multiavatar.com/Lucas.svg' },
            '41715': { name: 'احمد حسام', icon: 'https://api.multiavatar.com/Guadalajara.svg' },
            '58471': { name: 'عبدالرحمن شعبان', icon: 'https://api.multiavatar.com/ba66683f68073901ea.svg' },
            '18054': { name: 'حنين السيد سليمان', icon: 'https://api.multiavatar.com/9b8b2ae7d917ccd9ce.svg' },
            '20321': { name: 'بسنت محمد', icon: 'https://api.multiavatar.com/240315fc1890fd05ae.svg' },
            '52182': { name: 'عمر وليد جمال', icon: 'https://api.multiavatar.com/4db29acccc604fe610.svg' }
        };

        const activeUsers = {}; // Define activeUsers

        function login() {
            const username = document.getElementById('username').value.trim();
            const videoHeading = document.getElementById('video-heading');
            const userIcon = document.getElementById('user-icon');
            const userName = document.getElementById('user-name');

            if (username === '') {
                alert('Please enter a username.');
                return;
            }

            if (userDetails[username]) {
                if (Object.keys(activeUsers).length > 0) {
                    alert('Another user is already logged in. Please log out first.');
                    return;
                }

                activeUsers[username] = true;
                document.getElementById('login-container').classList.add('hidden');
                document.getElementById('video-container').classList.remove('hidden');

                const userDetail = userDetails[username];
                videoHeading.innerHTML = 'The Process platform';
                userIcon.src = userDetail.icon;  // Set user's icon
                userName.textContent = userDetail.name;  // Set user's name

                // Replace numeric username with a placeholder or masked string
                document.getElementById('username').value = '********'; 
            } else {
                alert('Invalid username');
            }
        }

        function handleEnterKey(event) {
            if (event.key === 'Enter') {
                login();
            }
        }

        function showVideo(videoId) {
            document.querySelectorAll('.video-container').forEach(video => {
                video.classList.add('hidden');
            });
            document.getElementById(videoId).classList.remove('hidden');
        }

        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
        }

        document.getElementById('theme-switch').addEventListener('change', toggleDarkMode);
    </script>
