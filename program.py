from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
import os
import fitz
os.environ["OPENAI_API_KEY"] = "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"
def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pf = os.path.join('uploads' ,pdf)
        #pf=os.path.join('pageapp' ,pdf)
        #print(pdf_path)
        #print(pf)
        pff=os.path.join('pageapp' ,pf)
        print(pff)
        ab=os.path.abspath(pf)
        print("sbdodhfrn",ab)
        doc = fitz.open(ab)
        
        for page_number in range(doc.page_count):
             page = doc[page_number]
             text += page.get_text()

        doc.close()
    return text
    

def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

def get_vectorstore(text_chunks):
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore

def get_conversation_chain(vectorstore):
    llm = ChatOpenAI()
    memory = ConversationBufferMemory(
        memory_key='chat_history', return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )
    return conversation_chain

def process_user_question(user_question, pdf_docs):
    load_dotenv()  # Assuming you are using dotenv to load environment variables

    # Get pdf text
    raw_text = get_pdf_text(pdf_docs)
    # Get the text chunks
    text_chunks = get_text_chunks(raw_text)
    # Create vector store
    vectorstore = get_vectorstore(text_chunks)
    # Create conversation chain
    conversation_chain = get_conversation_chain(vectorstore)

    # Handle user input and get response
    response = conversation_chain({'question': user_question})
    chat_history = response['chat_history']

    # Print or return the response
    responses = []
    for i, message in enumerate(chat_history):
        responses.append(message.content)

    return responses
#ans=process_user_question('benefit of highe entropy alloys', ['Wen-Machine_learning_assisted_design_of_high_entropy_alloys_with_desired_property.pdf'])
#print(ans)
