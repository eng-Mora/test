<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Educational Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-weight: bold;
            margin: 0;
            padding: 0;
            background-color: #718e97;
        }
        nav {
            background-color: #6a828a;
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
            background-color: #6D1865;
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
            max-width: 500px;
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
            background-color: #007bff; /* Change this to your preferred color */
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: bold;
        }
        button:hover {
            background-color: #0056b3; /* Change this for the hover effect */
        }
        .error {
            color: red;
            margin-top: 1rem;
        }
        .hidden {
            display: none;
        }
        .welcome-message {
            font-size: 1.5rem;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .videos-button {
            color: #6D1865;
            background-color: #2c3e50; /* Dark color for the button */
            padding: 5px 15px;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s ease;
        }
        .videos-button:hover {
            background-color: #1a252f; /* Slightly darker on hover */
        }
    </style>
</head>
<body>
    <nav id="nav">
        <ul>
        </ul>
    </nav>
    
    <main id="main" style="display:none;">
        <section id="home">
            <div style="text-align: center; padding: 20px; border-radius: 8px;">
                <img src="https://i.ibb.co/59zvgNq/image-removebg-preview-6-removebg-preview-1.png" alt="The Process Platform Image" style="width: 100%; max-width: 400px; margin-bottom: 20px;">
                <h2 style="color: white;">The Process Platform</h2>
            </div>
        </section>

        <section id="videos" class="video-container">
<select id="videoSelector" style="padding: 10px; font-size: 16px; background-color: #3A5795; color: white; border: none;">
            <option value="video1">.....option.....</option>
                <option value="video1">Magnetic flux </option>
                <option value="video2">Flux density due to current passing in straight wire</option>
                <option value="video3">Total flux density</option>
                <option value="video4">Cicular coil </option>
                <option value="video5">Solenoid </option>
                <option value="video6">Magnetic force </option>
                <option value="video7">Torque </option>
                <option value="video8">Galvanometer </option>
                <option value="video9">Ammeter </option>
                <option value="video10">Voltmeter </option>
                <option value="video11">Ohmmeter </option>
                <option value="video12">Important on devices</option>
                <option value="video13">Lecture 1 exercises</option>
                <option value="video14">Lecture 2 exercises</option>
                <option value="video15">Lecture 3 exercises</option>
                <option value="video16">Lecture 4 exercises</option>
                
                
            </select>
            
            
            
            <div class="video" id="video1" style="display: none;">
                <h1 class="video-title">Magnetic flux</h1>
     <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/4491d0b21912ebcdcd/5b1354c14c4caf23' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
                 </div>

            <div class="video" id="video2" style="display: none;">
            <h1 class="video-title">Flux density due to current passing in straight wire</h1>
               <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/0691d0b21913e3ce8f/d1eaa9f23748c0f6' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
            </div>
            
              <div class="video" id="video3" style="display: none;">
            <h1 class="video-title"> Total flux density</h1>
               <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/ac91d0b21919e3c625/2c11e91cf89b2b46' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
            </div>
          
              <div class="video" id="video4" style="display: none;">
            <h1 class="video-title">Cicular coil </h1>
                <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/d391d0b21913e3cf5a/d2d31be031c54418' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
            </div>
            
              <div class="video" id="video5" style="display: none;">
            <h1 class="video-title"> Solenoid</h1>
                <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/4d91d0b21919e0c0c4/19b1d081cb748686' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
            </div>
            
              <div class="video" id="video6" style="display: none;">
            <h1 class="video-title">Magnetic force </h1>
                <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/a791d0b21912e9c02e/6e552af326935c85' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
            </div>
            
              <div class="video" id="video7" style="display: none;">
            <h1 class="video-title"> Torque</h1>
            <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/4d91d0b21919e1c1c4/8ba79be3b5512c60' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
            </div>
            
              <div class="video" id="video8" style="display: none;">
            <h1 class="video-title"> Galvanometer</h1>
                <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/a791d0b21913e3cb2e/25b6cdffb9b1ce15' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
            </div>
            
              <div class="video" id="video9" style="display: none;">
            <h1 class="video-title">Ammeter </h1>
               <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/7091d0b21913e2c9f9/1ae4cbdba0a59c18' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
            </div>
            
              <div class="video" id="video10" style="display: none;">
            <h1 class="video-title"> Voltmeter</h1>
                <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/7091d0b21913edc6f9/61e35b224ebf56cd' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
            </div>
             
              <div class="video" id="video11" style="display: none;">
            <h1 class="video-title"> Ohmmeter</h1>
                <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/4d91d0b2191aebc8c4/7c62f5e3fda8db71' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
            </div>
              <div class="video" id="video12" style="display: none;">
            <h1 class="video-title"> Important on devices</h1>
                <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/4491d0b21913e3c4cd/0123a282367449b8' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
            </div>
            
                          <div class="video" id="video13" style="display: none;">
            <h1 class="video-title"> Lecture 1 exercises</h1>
             <h1 class="video-title"> part 1</h1>
              <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/a791d0b2181de5c22e/5ce15a2882fe9e9f' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
                        <h1 class="video-title"> part 2</h1>
           <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/1191d0b2191ae0cf98/3ceef39c1b3baae7' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe> 
                         <h1 class="video-title"> part 3</h1>
<iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/ac91d0b21812efc025/be5244c31fade634' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
             <h1 class="video-title"> Answers </h1>
<iframe src="https://drive.google.com/file/d/1HRHFQLfHd2o9IP6VWlQxP9fb_Emc4OLp/preview" width="640" height="480" allow="autoplay"></iframe>
           </div>

                          <div class="video" id="video14" style="display: none;">
            <h1 class="video-title"> Lecture 2 exercises</h1>
           <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/7991d0b21812e3cdf0/ea0a150b4abf0b0d' width='640' height='1067' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
                        <h1 class="video-title"> Answers </h1>
<iframe src="https://drive.google.com/file/d/1pcHjD3Huv8Pidjv-HeOH6Ye2xyzDAa5U/preview" width="640" height="480" allow="autoplay"></iframe>
           </div>

                          <div class="video" id="video15" style="display: none;">
            <h1 class="video-title"> Lecture 3 exercises</h1>
           <iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/0691d0b21813ecc08f/5cb19cdd1e073420' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
                                   <h1 class="video-title"> Answers </h1>
<iframe src="https://drive.google.com/file/d/1TZi6TNlsyrpIuqdMH1t9Di1QuoP6IS-Y/preview" width="640" height="480" allow="autoplay"></iframe>
                      </div>
                      <div class="video" id="video16" style="display: none;">
            <h1 class="video-title"> Lecture 4 exercises</h1>
                        <h1 class="video-title"> part 1</h1>
<iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/ac91d0b2191be4c325/515d4ea967fbc5a1' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
                                   <h1 class="video-title"> part 2</h1>
<iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/7091d0b2191beac9f9/9a7288fba7f931fd' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
                                              <h1 class="video-title"> part 3</h1>
<iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/4d91d0b2191ae2c1c4/0e573682c16b932e' width='640' height='384' frameborder='0' allowfullscreen referrerpolicy='no-referrer-when-downgrade' title='Video Player'></iframe>
                                   <h1 class="video-title"> Answers </h1>
<iframe src="https://drive.google.com/file/d/1sJFO881mbgaIQpjSaulS10k9gj6W3_xW/preview" width="640" height="480" allow="autoplay"></iframe>
                      </div>
        </section>
        
        <section id="contact">
            <h2>Contact Us</h2>
            <p>If you have any questions or need further information, feel free to contact us at <a href="mailto:info@educationwebsite.com">mamrro8529@gmail.com</a>.</p>
            <div class="social-icons">
                <a href="https://wa.me/message/5LRM2DVHPZQFM1" target="_blank">
                    <img src="https://img.icons8.com/fluent/48/000000/whatsapp.png" alt="WhatsApp" />
                </a>
                <a href="https://www.facebook.com/mamro8529?mibextid=ZbWKwL" target="_blank">
                    <img src="https://img.icons8.com/fluent/48/000000/facebook-new.png" alt="Facebook" />
                </a>
                <a href="http://t.me/Mora_mo1" target="_blank">
                    <img src="https://img.icons8.com/fluent/48/000000/telegram-app.png" alt="Telegram" />
                </a>
                <p>Developed by Eng: Amr Mohamed</p>
            </div>
        </section>
    </main>

    <div class="login-container" id="loginContainer">
        <img src="https://i.ibb.co/nmgZDmT/Whats-App-Image-2024-09-04-at-15-05-46-removebg-preview.png" alt="Login Image" style="width: 60%; max-width: 300px; margin-bottom: 20px;">
        <h1>Login to The Process platform</h1>
        <form id="loginForm">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>
            <button type="submit">Login</button>
            <div id="errorMessage" class="error"></div>
        </form>
        <p>Developed by Eng: Amr Mohamed</p>
    </div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const loginContainer = document.getElementById('loginContainer');
    const mainContent = document.getElementById('main');
    const videoSelector = document.getElementById('videoSelector');
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');

    function showLogin() {
        loginContainer.style.display = 'block';
        mainContent.style.display = 'none';
    }

    function showMainContent() {
        loginContainer.style.display = 'none';
        mainContent.style.display = 'block';
    }

    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const errorMessage = document.getElementById('errorMessage');

        // List of valid usernames
        const validUsernames = [
            '45454', '0' ,'60752', '29316', '10592', '84267', 
        '37518', '86247', '82654', '31605', '82436', '59123', '93821', '79824', '10547', '43096', '27509', '94251', 
        '94238', '71825', '60194', '63472', '68025', '94257', '43712', '85213', '71489', '37486', '59184', '40958', 
        '27936', '68047', '31562', '85947', '23947', '58372', '91763', '48205', '75314', '10658', '58260', '39471', 
        '93487', '52863', '31705', '78102', '46852', '63458', '19273', '91426', '60128'
        ];

        // Validate username
        if (validUsernames.includes(username)) {
            errorMessage.textContent = '';
            showMainContent();
        } else {
            errorMessage.textContent = 'Invalid username';
        }
    });

    // Video selection handler
    videoSelector.addEventListener('change', function() {
    // Hide all videos initially
    for (let i = 1; i <= 17; i++) {
        let video = document.getElementById('video' + i);
        if (video) {
            video.style.display = 'none';
        }
    }

    // Show the selected video
    let selectedVideo = videoSelector.value;
    let videoToShow = document.getElementById(selectedVideo);
    if (videoToShow) {
        videoToShow.style.display = 'block';
    }
});


    showLogin();
});
</script>

