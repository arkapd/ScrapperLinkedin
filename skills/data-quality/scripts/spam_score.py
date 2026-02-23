import re

def calculate_spam_score(text, email=""):
    score = 0
    feedback = []

    # Email signal (High Weight)
    if "@gmail.com" in email.lower() or "@yahoo.com" in email.lower():
        score += 50
        feedback.append("Free email domain (+50)")

    # Keyword check
    spam_keywords = ["registration fee", "pay to join", "MLM", "network marketing", "investment required"]
    for k in spam_keywords:
        if k in text.lower():
            score += 30
            feedback.append(f"Spam keyword '{k}' found (+30)")

    # Formatting signals
    if text.isupper():
        score += 20
        feedback.append("All caps text (+20)")
        
    phone_numbers = re.findall(r'\d{10}', text)
    if len(phone_numbers) > 3:
        score += 25
        feedback.append(f"Excessive phone numbers ({len(phone_numbers)}) found (+25)")

    if len(text) < 50:
        score += 15
        feedback.append("Post too short (+15)")

    return score, feedback

# Test
print(calculate_spam_score("URGENT HIRING REGISTRATION FEE REQUIRED CALL 9999999999 8888888888 7777777777 6666666666", "jobs@gmail.com"))
