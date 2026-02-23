import json
import os

def validate_jobs_json(file_path):
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return False
        
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        if not isinstance(data, list):
            print("Error: JSON root must be a list.")
            return False
            
        required_keys = ["role", "location", "experience", "contact", "link"]
        for i, job in enumerate(data):
            missing = [k for k in required_keys if k not in job]
            if missing:
                print(f"Job {i} missing keys: {missing}")
                return False
                
        print(f"Success: {len(data)} jobs validated.")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

# Run validation
validate_jobs_json('jobs.json')
