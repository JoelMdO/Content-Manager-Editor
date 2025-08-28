# AI Watermark Generator for Content Manager Editor

## Overview

This feature adds intelligent AI-powered watermark generation capabilities to the Content Manager Editor. The system uses computer vision and machine learning techniques to automatically find optimal watermark placement and adjust opacity based on image complexity.

## Architecture

The watermark system consists of three main components:

### 1. Python AI Service (`python_services/watermark_generator/`)
- **watermark_service.py**: Core AI watermark generation service
- **Dockerfile**: Container configuration for the Python service
- **requirements.txt**: Python dependencies
- **test_service.py**: Test script for validating the service

### 2. Next.js API Integration (`src/app/api/watermark/`)
- **route.ts**: API endpoint that interfaces with the Python service
- Handles authentication and request/response formatting
- Provides health checks for the watermark service

### 3. Frontend Components (`src/components/dashboard/watermark/`)
- **watermark_config.tsx**: React component for watermark configuration UI
- **watermark_utils.ts**: Utility functions for watermark integration

## Features

### AI-Powered Placement
- **Edge Detection**: Uses Canny edge detection to identify important image content
- **Texture Analysis**: Employs Local Binary Patterns for texture complexity assessment
- **Saliency Mapping**: Calculates gradient magnitude to find optimal placement areas
- **Intelligent Positioning**: Automatically selects positions with minimal visual interference

### Watermark Types
1. **Text Watermarks**
   - Customizable text content
   - Adjustable font size (24-72px)
   - Color selection
   - AI-recommended color based on image brightness

2. **Logo Watermarks**
   - Upload custom logo images
   - Automatic sizing and aspect ratio preservation
   - Transparent background support

### Adaptive Opacity
- Automatically adjusts opacity based on image complexity
- Higher opacity for high-contrast areas
- Lower opacity for complex textures
- Base opacity range: 0.1 to 1.0

## Installation & Setup

### Prerequisites
- Docker and Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for Next.js integration)

### Quick Start with Docker

1. **Build and run the watermark service:**
   ```bash
   docker-compose up watermark-service
   ```

2. **Test the service:**
   ```bash
   cd python_services/watermark_generator
   python test_service.py
   ```

### Local Development Setup

1. **Install Python dependencies:**
   ```bash
   cd python_services/watermark_generator
   pip install -r requirements.txt
   ```

2. **Run the Python service:**
   ```bash
   python watermark_service.py
   ```

3. **Set environment variable for Next.js:**
   ```bash
   export WATERMARK_SERVICE_URL=http://localhost:5000
   ```

## API Reference

### Python Service Endpoints

#### Health Check
```
GET /health
Response: {"status": "healthy", "service": "AI Watermark Generator"}
```

#### Image Analysis
```
POST /analyze
Body: {"image_data": "base64_encoded_image"}
Response: {
  "success": true,
  "complexity_analysis": {
    "edge_density": 0.15,
    "texture_variance": 850.2,
    "brightness_mean": 128.5,
    "brightness_std": 45.3
  },
  "recommendations": {
    "opacity": 0.4,
    "position": [650, 450],
    "size": [200, 67],
    "recommended_color": "white"
  }
}
```

#### Watermark Generation
```
POST /watermark
Body: {
  "image_data": "base64_encoded_image",
  "watermark_config": {
    "type": "text",
    "text": "Sample Watermark",
    "font_size": 48,
    "color": "white",
    "opacity": 0.3
  }
}
Response: {
  "success": true,
  "watermarked_image": "base64_encoded_result",
  "message": "Watermark applied successfully"
}
```

### Next.js API Endpoint

#### Watermark Generation
```
POST /api/watermark
Content-Type: multipart/form-data

Form fields:
- image: File (required)
- watermark_type: "text" | "logo"
- watermark_text: string (for text type)
- font_size: number (24-72)
- color: string (hex color)
- opacity: number (0.1-1.0)
- logo: File (for logo type)

Response: {
  "success": true,
  "watermarked_image": "base64_encoded_result",
  "message": "Watermark applied successfully"
}
```

## Integration with Existing Image Upload

The watermark functionality is integrated into the existing image upload workflow in `upload_image.ts`:

```typescript
// Enhanced function signature with watermark options
const uploadImage = async (
  e: ChangeEvent<HTMLInputElement>,
  editorRef: HTMLDivElement | null,
  dbName: string,
  watermarkOptions?: WatermarkOptions
): Promise<UploadImageResult>
```

### Usage Example

```typescript
import { applyWatermarkToImage } from '../../utils/watermark/watermark_utils';

const watermarkOptions = {
  enabled: true,
  type: 'text',
  text: 'Copyright 2024',
  fontSize: 48,
  color: 'white',
  opacity: 0.3
};

// The upload function now automatically applies watermarks if enabled
await uploadImage(event, editorRef, dbName, watermarkOptions);
```

## Technical Details

### AI Algorithms Used

1. **Canny Edge Detection**
   - Identifies edges and important content boundaries
   - Helps avoid placing watermarks over critical image features

2. **Local Binary Patterns (LBP)**
   - Analyzes texture complexity
   - Determines areas suitable for watermark placement

3. **Gradient Magnitude Calculation**
   - Creates saliency maps to identify visual importance
   - Guides optimal placement decisions

4. **Brightness Analysis**
   - Calculates mean and standard deviation of image brightness
   - Recommends appropriate watermark colors and opacity

### Performance Considerations

- **Image Processing**: Optimized for images up to 5MB
- **Response Time**: Typical processing time 2-5 seconds for standard images
- **Memory Usage**: Efficient memory management for batch processing
- **Scalability**: Stateless service design allows horizontal scaling

## Troubleshooting

### Common Issues

1. **Service Unavailable**
   - Check if the Python service is running on port 5000
   - Verify WATERMARK_SERVICE_URL environment variable

2. **Font Errors**
   - Ensure DejaVu fonts are installed in the container
   - Fallback to default font if specific fonts unavailable

3. **Memory Issues**
   - Reduce image size before processing
   - Check available system memory

### Logs

Enable debug logging in the Python service:
```python
logging.basicConfig(level=logging.DEBUG)
```

## Future Enhancements

1. **Batch Processing**: Support for multiple image watermarking
2. **Template System**: Predefined watermark templates
3. **Brand Management**: Organization-specific watermark settings
4. **Advanced Positioning**: Rule-based placement algorithms
5. **Performance Optimization**: GPU acceleration for large images

## Contributing

When contributing to the watermark feature:

1. Follow the existing code preservation guidelines (comment original code)
2. Add tests for new functionality
3. Update documentation for any API changes
4. Ensure Docker builds work correctly
5. Test with various image types and sizes