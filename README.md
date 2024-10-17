from flask import Flask

# Create a Flask app instance
app = Flask(__name__)

# Define the route for the home page
@app.route('/')
def home():
    return '''
    <html>
        <head>
            <title>Simple Web Page</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    text-align: center;
                    margin-top: 50px;
                }
                h1 {
                    color: #333;
                }
                p {
                    font-size: 18px;
                }
            </style>
        </head>
        <body>
            <h1>Welcome to My Simple Web Page</h1>
            <p>This is a simple web page created using Python and Flask.</p>
            <p>Feel free to explore Flask for more complex web applications!</p>
        </body>
    </html>
    '''

# Start the Flask development server
if __name__ == '__main__':
    app.run(debug=True)
