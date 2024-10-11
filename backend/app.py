from flask import Flask, request, jsonify 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/')
def hello_world():
    return "Hello, World!"

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file:
        # Here you would process the file (e.g., parsing or saving it)
        return jsonify({'message': 'File received', 'filename': file.filename})
    return jsonify({'error': 'No file uploaded'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2500)
