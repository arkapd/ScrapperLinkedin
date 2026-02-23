import re

def is_fresher_relevant(text):
    text = text.lower()
    
    # Negative signals (priority)
    exp_matches = re.findall(r'(\d+)\s*\+\s*years', text)
    if exp_matches and any(int(m) >= 2 for m in exp_matches):
        return False, "Experience too high (X+ years)"
        
    range_matches = re.findall(r'(\d+)\s*-\s*(\d+)\s*years', text)
    if range_matches and any(int(m[0]) >= 2 for m in range_matches):
        return False, "Experience range too high (X-Y years)"
        
    senior_keywords = ["senior", "lead", "manager", "director", "staff engineer"]
    if any(k in text for k in senior_keywords):
        return False, "Seniority keyword found"

    # Positive signals
    fresher_keywords = ["fresher", "entry level", "batch 2024", "batch 2025", "graduate", "0-1 year"]
    if any(k in text for k in fresher_keywords):
        return True, "Fresher signal found"
        
    return False, "No signals found"

# Test Cases
test_cases = [
    ("Looking for freshers batch 2024", True),
    ("Senior Manager with 10+ years experience", False),
    ("SDE 1, 0-1 year experience, Pune", True),
    ("Entry level role for graduates", True),
    ("Software Engineer, 3-5 years required", False)
]

for post, expected in test_cases:
    result, reason = is_fresher_relevant(post)
    print(f"Post: {post[:30]}... | Expected: {expected} | Actual: {result} ({reason})")
