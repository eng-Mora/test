<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Your Favicon</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            text-align: center;
            padding: 50px;
        }
        #favicon-preview {
            margin: 20px;
            border: 1px solid #ddd;
            width: 64px;
            height: 64px;
        }
        .menu-content {
            background-color: #34495e;
            color: white;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            display: inline-block;
            border-radius: 8px;
            margin-top: 20px;
        }
    </style>
</head>
<body>

    <h1>Create Your Favicon</h1>
    <p>Upload an image to create a favicon</p>

    <input type="file" id="upload" accept="image/*">
    <div class="menu-content">
        <p>Preview:</p>
        <img id="favicon-preview" src="" alt="Favicon Preview">
    </div>
    <a id="download-link" class="menu-content" href="#" download="favicon.ico">Download Favicon</a>

    <script>
        const upload = document.getElementById('upload');
        const preview = document.getElementById('favicon-preview');
        const downloadLink = document.getElementById('download-link');

        upload.addEventListener('change', function() {
            const file = upload.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;

                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        canvas.width = 64;
                        canvas.height = 64;

                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, 64, 64);

                        preview.src = canvas.toDataURL('image/png');
                        downloadLink.href = canvas.toDataURL('image/x-icon');
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    </script>

