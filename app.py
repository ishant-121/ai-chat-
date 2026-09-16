from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from groq import Groq
import os

load_dotenv()

app = Flask(__name__)
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def ask_groq(message):
    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "user", "content": message}]
    )
    return response.choices[0].message.content


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message", "")

    if not message:
        return jsonify({"error": "No message provided"}), 400

    try:
        reply = ask_groq(message)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(debug=True)