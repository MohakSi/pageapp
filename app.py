
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
import os
from werkzeug.utils import secure_filename
from program import process_user_question
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

os.environ["OPENAI_API_KEY"] = "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"

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route('/uploadFiles', methods=['POST'])
def upload_files():
    try:
        print(request.files)
        if 'pdfFiles' not in request.files:
            return jsonify({'error': 'No PDF files provided'})

        files = request.files.getlist('pdfFiles')

        uploaded_file_paths = []

        for file in files:
            if file and allowed_file(file.filename):
                # Securely generate a filename and save the file
                filename = secure_filename(file.filename)
                print('Filename:', filename)
                print('absolute Filename:', os.path.abspath(filename))
                file_path = os.path.join('uploads', filename)
                print(file_path)
                file.save(os.path.normpath(file_path))
                uploaded_file_paths.append(os.path.normpath(file_path))
        print('Uploaded file paths:', uploaded_file_paths) 
        return jsonify({'message': 'Files uploaded successfully', 'file_paths': uploaded_file_paths})
    except Exception as e:
        return jsonify({'error': str(e)})
@app.route('/search', methods=['POST'])
def search():
    
        query = request.json.get('query', '')
        file_paths = request.json.get('file_paths', [])
        fp=[]
        for f in file_paths:
            
            fp.append(str(f))
        print('File Paths:', fp)
        answer=process_user_question(query,fp)
        return jsonify({'result':answer})
        
if __name__ == '__main__':
    app.run(port=5001, debug=True)
