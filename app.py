from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)

# Simulated AI logic (you can replace with RAG later)
def generate_response(user_input):
    user_input = user_input.lower()

    if "hello" in user_input:
        return "Hello 👋 I am DevBrain AI."

    if "time" in user_input:
        return f"Current time is {datetime.now().strftime('%H:%M:%S')}"

    if "date" in user_input:
        return f"Today's date is {datetime.now().strftime('%Y-%m-%d')}"

    if "rag" in user_input:
        return "RAG system integrates retrieval with generation."

    return "Interesting question 🤔 Tell me more."

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.json.get("message")
    response = generate_response(user_input)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)