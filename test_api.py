import requests

api_key = "bu_MjEP6kSzOuk2BjwPrJcq9iShSnHMX9VrZ-uU2Uau7Gc"
session_id = "d7067fda-1b0a-4c6e-a77d-d8f4b144ea31"

endpoints = [
    ("https://api.browser-use.com/api/v1/sessions/", {"Authorization": f"Bearer {api_key}"}),
    ("https://api.browser-use.com/api/v1/sessions/", {"X-Browser-Use-API-Key": api_key}),
    ("https://cloud.browser-use.com/api/v1/sessions/", {"Authorization": f"Bearer {api_key}"}),
    ("https://cloud.browser-use.com/api/v1/sessions/", {"X-Browser-Use-API-Key": api_key}),
    ("https://api.browserbase.com/v1/sessions/", {"x-bb-api-key": api_key})
]

for url_base, headers in endpoints:
    url = url_base + session_id
    try:
        response = requests.get(url, headers=headers)
        print(f"URL: {url}")
        print(f"Headers: {headers.keys()}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}")
        print("-" * 40)
    except Exception as e:
        print(f"Failed {url}: {e}")
