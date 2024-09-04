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
    </style>
</head>
<body>
    <header>
        <h1>Welcome to the Process Website</h1>
    </header>
    
    <nav>
        <ul>
            <li><a href="https://eng-mora.github.io/The_Process/" target="_blank">Home</a></li>
            <li><a href="#videos">Videos</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>
    
    <main>
        <section id="home">
            <h2>About Our the Process Platform</h2>
            <p>This website is dedicated to providing high-quality educational content through videos and other resources.</p>
        </section>
        
        <section id="videos" class="video-container">
            <h2>Educational Videos</h2>
            <!-- Wistia Video 1 -->
            <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 60%;"><iframe src="https://fast.wistia.net/embed/iframe/xuqh31qejk" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media;"></iframe></div>
            <h2>About Our Educational Platform</h2>
            <!-- Wistia Video 2 -->
            <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 55.9375%;"><iframe src="https://fast.wistia.net/embed/iframe/iu5pz1rqv3" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media;"></iframe></div>
            <h2>About Our Educational Platform</h2>
            <!-- Wistia Video 3 -->
            <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 60%;"><iframe src="https://fast.wistia.net/embed/iframe/89kzetd3dy" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media;"></iframe></div>
        </section>
        
        <section id="contact">
            <h2>Contact Us</h2>
            <p>If you have any questions or need further information, feel free to contact us at <a href="mailto:info@educationwebsite.com">mamrro8529@gmail.com</a>.</p>
        </section>
    </main>
