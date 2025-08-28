#!/usr/bin/env python3
"""
Simple test script for the AI Watermark Generator Service
"""
import requests
import base64
import json
import os
from PIL import Image, ImageDraw
import io

def create_test_image():
    """Create a simple test image"""
    img = Image.new('RGB', (800, 600), color='lightblue')
    draw = ImageDraw.Draw(img)
    
    # Draw some simple shapes
    draw.rectangle([100, 100, 300, 200], fill='red', outline='black')
    draw.ellipse([400, 200, 600, 400], fill='green', outline='black')
    draw.text((350, 500), "Test Image", fill='black')
    
    # Save to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG', quality=95)
    img_bytes.seek(0)
    
    return img_bytes.getvalue()

def test_watermark_service():
    """Test the watermark service"""
    # Base URL for the service
    base_url = "http://localhost:5000"
    
    print("Testing AI Watermark Generator Service...")
    
    # Test 1: Health check
    print("\n1. Testing health check...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"Response: {response.json()}")
        else:
            print("❌ Health check failed")
            return
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return
    
    # Test 2: Image analysis
    print("\n2. Testing image analysis...")
    test_image_data = create_test_image()
    test_image_b64 = base64.b64encode(test_image_data).decode('utf-8')
    
    try:
        response = requests.post(f"{base_url}/analyze", 
                               json={"image_data": test_image_b64})
        if response.status_code == 200:
            print("✅ Image analysis passed")
            analysis_result = response.json()
            print(f"Complexity: {analysis_result.get('complexity_analysis', {})}")
            print(f"Recommendations: {analysis_result.get('recommendations', {})}")
        else:
            print("❌ Image analysis failed")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Image analysis error: {e}")
    
    # Test 3: Text watermark
    print("\n3. Testing text watermark...")
    watermark_config = {
        "type": "text",
        "text": "AI Generated Watermark",
        "font_size": 48,
        "color": "white",
        "opacity": 0.5
    }
    
    try:
        response = requests.post(f"{base_url}/watermark", 
                               json={
                                   "image_data": test_image_b64,
                                   "watermark_config": watermark_config
                               })
        if response.status_code == 200:
            print("✅ Text watermark generation passed")
            result = response.json()
            
            # Save the watermarked image
            watermarked_data = base64.b64decode(result["watermarked_image"])
            with open("/tmp/watermarked_test.jpg", "wb") as f:
                f.write(watermarked_data)
            print("Watermarked image saved to /tmp/watermarked_test.jpg")
        else:
            print("❌ Text watermark generation failed")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Text watermark error: {e}")
    
    print("\n🎉 All tests completed!")

if __name__ == "__main__":
    test_watermark_service()