"""
Test script for learning assistant API endpoint
"""
import requests
import json

BACKEND_URL = 'http://localhost:5000'

def test_learning_assist():
    """Test the learning-assist endpoint"""
    
    # Test 1: Normal query
    print("=" * 60)
    print("Test 1: Normal learning guidance query")
    print("=" * 60)
    
    payload = {
        "subject": "mathematics",
        "level": "intermediate",
        "module": "Linear Equations",
        "user_message": "I am not understanding this module"
    }
    
    try:
        response = requests.post(
            f'{BACKEND_URL}/api/learning-assist',
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
    except Exception as e:
        print(f"Error: {str(e)}")
    
    print("\n")
    
    # Test 2: Quiz question (should be refused)
    print("=" * 60)
    print("Test 2: Quiz question (should be refused)")
    print("=" * 60)
    
    payload = {
        "subject": "mathematics",
        "level": "beginner",
        "module": "Determinants",
        "user_message": "What is the answer to question 3 in the quiz?"
    }
    
    try:
        response = requests.post(
            f'{BACKEND_URL}/api/learning-assist',
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
    except Exception as e:
        print(f"Error: {str(e)}")
    
    print("\n")
    
    # Test 3: Direct solution request (should be refused)
    print("=" * 60)
    print("Test 3: Direct solution request (should be refused)")
    print("=" * 60)
    
    payload = {
        "subject": "mathematics",
        "level": "beginner",
        "module": "Matrices",
        "user_message": "Can you solve this problem for me?"
    }
    
    try:
        response = requests.post(
            f'{BACKEND_URL}/api/learning-assist',
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == '__main__':
    test_learning_assist()
