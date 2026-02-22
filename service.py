from datetime import datetime

def generate_ai_response(message: str) -> str:
    message = message.lower()

    if "hello" in message:
        return "Hello 👋 I am DevBrain AI."

    if "time" in message:
        return f"Current time: {datetime.now().strftime('%H:%M:%S')}"

    if "python" in message:
        return "Python is powerful for AI, web, and automation."

    if "javascript" in message:
        return "JavaScript powers frontend and backend with Node.js."

    return "I'm still learning 🤖 Tell me more!"