from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import extract_replay_data, summarise_replay_data

app = Flask(__name__)
CORS(app)  # Enable CORS

# Route to handle file upload and data extraction
@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file:
        if file.content_length > 1048576: 
            return jsonify({'error': 'File size exceeds the 1MB limit.'}), 400
         
        if not file.filename.endswith('.SC2Replay'):
            return jsonify({'error': 'Invalid file type. Only .SC2Replay files are allowed.'}), 400

        replay_data = extract_replay_data(file)
        return jsonify(summarise_replay_data(replay_data))
    return jsonify({'error': 'No file uploaded'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=2500)
