import json
import os
from datetime import datetime, timedelta

def check_scraper_health(file_path):
    if not os.path.exists(file_path):
        return False, "jobs.json missing"
        
    try:
        mod_time = os.path.getmtime(file_path)
        last_modified = datetime.fromtimestamp(mod_time)
        
        # Check if modified in last 24 hours
        if datetime.now() - last_modified > timedelta(hours=24):
            return False, f"Stale data: Last updated {last_modified}"
            
        with open(file_path, 'r') as f:
            data = json.load(f)
            if len(data) == 0:
                return False, "Data is empty"
                
        return True, f"Healthy: {len(data)} jobs found, last updated {last_modified}"
    except Exception as e:
        return False, str(e)

# Run check
status, msg = check_scraper_health('jobs.json')
print(f"Status: {'✅' if status else '❌'} | Message: {msg}")
