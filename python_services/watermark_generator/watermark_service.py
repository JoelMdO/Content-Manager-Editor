#==========================================
# AI Watermark Generator Service
#==========================================
# This service provides intelligent watermark generation for images
# using computer vision and machine learning techniques for optimal placement

import os
import io
import base64
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
from flask import Flask, request, jsonify
from flask_cors import CORS
from skimage import feature, filters
from typing import Tuple, List, Dict, Optional
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIWatermarkGenerator:
    """
    #------------------------------------------
    # Purpose: Intelligent watermark generator using AI techniques
    # for optimal placement and visual integration
    #------------------------------------------
    """
    
    def __init__(self):
        self.default_font_size = 48
        self.default_opacity = 0.3
        self.edge_threshold = 0.1
        
    def analyze_image_complexity(self, image: np.ndarray) -> Dict[str, float]:
        """
        #------------------------------------------
        # Purpose: Analyze image complexity using edge detection 
        # and texture analysis for AI-based watermark placement
        #------------------------------------------
        """
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        
        # Edge detection using Canny
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / edges.size
        
        # Texture analysis using Local Binary Patterns
        radius = 3
        n_points = 8 * radius
        lbp = feature.local_binary_pattern(gray, n_points, radius, method='uniform')
        texture_variance = np.var(lbp)
        
        # Brightness analysis
        brightness_mean = np.mean(gray)
        brightness_std = np.std(gray)
        
        return {
            'edge_density': edge_density,
            'texture_variance': texture_variance,
            'brightness_mean': brightness_mean,
            'brightness_std': brightness_std
        }
    
    def find_optimal_watermark_position(self, image: np.ndarray, watermark_size: Tuple[int, int]) -> Tuple[int, int]:
        """
        #------------------------------------------
        # Purpose: Use AI techniques to find the optimal position for watermark
        # based on image content analysis and visual saliency
        #------------------------------------------
        """
        height, width = image.shape[:2]
        wm_width, wm_height = watermark_size
        
        # Create a grid of possible positions
        step_x = max(1, width // 20)
        step_y = max(1, height // 20)
        
        best_score = float('inf')
        best_position = (width - wm_width - 20, height - wm_height - 20)  # Default: bottom-right
        
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        
        # Calculate gradient magnitude for saliency
        grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        gradient_magnitude = np.sqrt(grad_x**2 + grad_y**2)
        
        for y in range(0, height - wm_height, step_y):
            for x in range(0, width - wm_width, step_x):
                # Extract region where watermark would be placed
                region = gray[y:y+wm_height, x:x+wm_width]
                gradient_region = gradient_magnitude[y:y+wm_height, x:x+wm_width]
                
                if region.size == 0:
                    continue
                
                # Calculate score (lower is better)
                # Prefer areas with low gradient (less important content)
                gradient_score = np.mean(gradient_region)
                
                # Prefer areas with uniform brightness
                brightness_variance = np.var(region)
                
                # Prefer corners and edges (traditional watermark placement)
                corner_bonus = 0
                if x < width * 0.2 or x > width * 0.8:
                    corner_bonus -= 50
                if y < height * 0.2 or y > height * 0.8:
                    corner_bonus -= 50
                
                total_score = gradient_score + brightness_variance * 0.5 + corner_bonus
                
                if total_score < best_score:
                    best_score = total_score
                    best_position = (x, y)
        
        return best_position
    
    def create_text_watermark(self, text: str, size: Tuple[int, int], font_size: int = None, color: str = 'white') -> Image.Image:
        """
        #------------------------------------------
        # Purpose: Create a text watermark with specified parameters
        #------------------------------------------
        """
        if font_size is None:
            font_size = self.default_font_size
            
        # Create transparent image for watermark
        watermark = Image.new('RGBA', size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(watermark)
        
        try:
            # Try to use a default font
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except (OSError, IOError):
            # Fallback to default font
            font = ImageFont.load_default()
        
        # Calculate text position (center)
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (size[0] - text_width) // 2
        y = (size[1] - text_height) // 2
        
        # Draw text
        draw.text((x, y), text, font=font, fill=color)
        
        return watermark
    
    def create_logo_watermark(self, logo_data: bytes, target_size: Tuple[int, int]) -> Image.Image:
        """
        #------------------------------------------
        # Purpose: Create a logo watermark from uploaded image data
        #------------------------------------------
        """
        logo_image = Image.open(io.BytesIO(logo_data))
        
        # Convert to RGBA if needed
        if logo_image.mode != 'RGBA':
            logo_image = logo_image.convert('RGBA')
        
        # Resize logo to target size while maintaining aspect ratio
        logo_image.thumbnail(target_size, Image.Resampling.LANCZOS)
        
        # Create transparent background with target size
        watermark = Image.new('RGBA', target_size, (0, 0, 0, 0))
        
        # Paste logo in center
        logo_x = (target_size[0] - logo_image.width) // 2
        logo_y = (target_size[1] - logo_image.height) // 2
        watermark.paste(logo_image, (logo_x, logo_y), logo_image)
        
        return watermark
    
    def apply_watermark(self, image_data: bytes, watermark_config: Dict) -> bytes:
        """
        #------------------------------------------
        # Purpose: Apply watermark to image using AI-based positioning
        # and intelligent opacity adjustment
        #------------------------------------------
        """
        # Load original image
        original_image = Image.open(io.BytesIO(image_data))
        if original_image.mode != 'RGB':
            original_image = original_image.convert('RGB')
        
        # Convert to numpy array for analysis
        image_array = np.array(original_image)
        
        # Analyze image complexity
        complexity = self.analyze_image_complexity(image_array)
        logger.info(f"Image complexity analysis: {complexity}")
        
        # Determine watermark size based on image size
        img_width, img_height = original_image.size
        watermark_width = min(300, img_width // 4)
        watermark_height = min(100, img_height // 8)
        
        # Create watermark based on type
        watermark_type = watermark_config.get('type', 'text')
        
        if watermark_type == 'text':
            text = watermark_config.get('text', 'Sample Watermark')
            font_size = watermark_config.get('font_size', self.default_font_size)
            color = watermark_config.get('color', 'white')
            watermark = self.create_text_watermark(text, (watermark_width, watermark_height), font_size, color)
        else:  # logo
            logo_data = base64.b64decode(watermark_config.get('logo_data', ''))
            watermark = self.create_logo_watermark(logo_data, (watermark_width, watermark_height))
        
        # Find optimal position using AI
        optimal_position = self.find_optimal_watermark_position(image_array, (watermark_width, watermark_height))
        logger.info(f"Optimal watermark position: {optimal_position}")
        
        # Adjust opacity based on image complexity
        base_opacity = watermark_config.get('opacity', self.default_opacity)
        
        # Increase opacity for high-contrast areas, decrease for complex textures
        if complexity['edge_density'] > 0.15:
            adjusted_opacity = min(base_opacity + 0.1, 0.8)
        elif complexity['texture_variance'] > 1000:
            adjusted_opacity = max(base_opacity - 0.1, 0.1)
        else:
            adjusted_opacity = base_opacity
        
        # Apply opacity to watermark
        watermark = watermark.convert('RGBA')
        alpha = watermark.split()[-1]
        alpha = ImageEnhance.Brightness(alpha).enhance(adjusted_opacity)
        watermark.putalpha(alpha)
        
        # Create a transparent overlay with the same size as original image
        overlay = Image.new('RGBA', original_image.size, (0, 0, 0, 0))
        overlay.paste(watermark, optimal_position, watermark)
        
        # Composite the watermark onto the original image
        original_rgba = original_image.convert('RGBA')
        watermarked = Image.alpha_composite(original_rgba, overlay)
        
        # Convert back to RGB
        final_image = watermarked.convert('RGB')
        
        # Save to bytes
        output = io.BytesIO()
        final_image.save(output, format='JPEG', quality=95)
        output.seek(0)
        
        return output.getvalue()

# Initialize the watermark generator
watermark_generator = AIWatermarkGenerator()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'AI Watermark Generator'})

@app.route('/watermark', methods=['POST'])
def generate_watermark():
    """
    #------------------------------------------
    # Purpose: Main endpoint for watermark generation
    # Accepts image and watermark configuration, returns watermarked image
    #------------------------------------------
    """
    try:
        data = request.get_json()
        
        if not data or 'image_data' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image data
        image_data = base64.b64decode(data['image_data'])
        
        # Get watermark configuration
        watermark_config = data.get('watermark_config', {})
        
        # Generate watermarked image
        watermarked_image_data = watermark_generator.apply_watermark(image_data, watermark_config)
        
        # Encode result as base64
        result_base64 = base64.b64encode(watermarked_image_data).decode('utf-8')
        
        return jsonify({
            'success': True,
            'watermarked_image': result_base64,
            'message': 'Watermark applied successfully'
        })
        
    except Exception as e:
        logger.error(f"Error generating watermark: {str(e)}")
        return jsonify({'error': f'Failed to generate watermark: {str(e)}'}), 500

@app.route('/analyze', methods=['POST'])
def analyze_image():
    """
    #------------------------------------------
    # Purpose: Analyze image for optimal watermark placement
    # Returns complexity metrics and recommended settings
    #------------------------------------------
    """
    try:
        data = request.get_json()
        
        if not data or 'image_data' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image data
        image_data = base64.b64decode(data['image_data'])
        
        # Load and analyze image
        image = Image.open(io.BytesIO(image_data))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        image_array = np.array(image)
        complexity = watermark_generator.analyze_image_complexity(image_array)
        
        # Find optimal position for a standard watermark size
        watermark_size = (min(300, image.width // 4), min(100, image.height // 8))
        optimal_position = watermark_generator.find_optimal_watermark_position(image_array, watermark_size)
        
        # Generate recommendations
        recommendations = {
            'opacity': 0.3 if complexity['edge_density'] < 0.15 else 0.4,
            'position': optimal_position,
            'size': watermark_size,
            'recommended_color': 'white' if complexity['brightness_mean'] < 128 else 'black'
        }
        
        return jsonify({
            'success': True,
            'complexity_analysis': complexity,
            'recommendations': recommendations
        })
        
    except Exception as e:
        logger.error(f"Error analyzing image: {str(e)}")
        return jsonify({'error': f'Failed to analyze image: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)