import time
import urllib.request
import os
import threading

# Ping Render App and Supabase to prevent cold starts
RENDER_URL = os.environ.get("RENDER_URL", "https://your-app-name.onrender.com")
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "https://your-supabase-url.supabase.co")

def ping():
    while True:
        try:
            if RENDER_URL != "https://your-app-name.onrender.com":
                print(f"[Keep-Alive] Pinging {RENDER_URL}...")
                urllib.request.urlopen(RENDER_URL)
            
            if SUPABASE_URL != "https://your-supabase-url.supabase.co":
                print(f"[Keep-Alive] Pinging {SUPABASE_URL}...")
                # A lightweight ping to Supabase health check or REST root
                urllib.request.urlopen(f"{SUPABASE_URL}/rest/v1/")
                
        except Exception as e:
            print(f"[Keep-Alive] Ping failed: {e}")
            
        # Ping every 14 minutes to prevent 15-min idle sleep on Render/Supabase free tiers
        time.sleep(840) 

if __name__ == "__main__":
    print("Starting Keep-Alive service...")
    ping()
