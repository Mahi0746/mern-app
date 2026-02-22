import re
from datetime import datetime

def clean_text(text: str) -> str:
    """
    Remove extra spaces and special characters.
    """
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def current_timestamp():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def validate_query(query: str) -> bool:
    """
    Basic validation for user query.
    """
    if not query:
        return False
    if len(query) < 2:
        return False
    return True

def check(self):
    print("This is a utility function.-----")
    
def check2(self):
    print("This is another utility function.-----")