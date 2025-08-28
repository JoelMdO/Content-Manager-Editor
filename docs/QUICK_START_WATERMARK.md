# Quick Start Guide: AI Watermark Generator

## Overview
This guide helps you quickly set up and use the AI-powered watermark generator in the Content Manager Editor.

## Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- Python 3.11+ (for local development)

## Quick Setup

### 1. Start the Watermark Service
```bash
# Using Docker (Recommended)
docker-compose up watermark-service

# Or for local development
cd python_services/watermark_generator
pip install -r requirements.txt
python watermark_service.py
```

### 2. Configure Environment
```bash
# Create environment file
cp .env.watermark.example .env.local

# Add to your .env.local
WATERMARK_SERVICE_URL=http://localhost:5000
```

### 3. Test the Service
```bash
cd python_services/watermark_generator
python validate_core.py
```

## Usage Examples

### Text Watermark
```typescript
import { applyWatermarkToImage } from '@/utils/watermark/watermark_utils';

const watermarkOptions = {
  enabled: true,
  type: 'text',
  text: 'Copyright 2024',
  fontSize: 48,
  color: '#ffffff',
  opacity: 0.3
};

const result = await applyWatermarkToImage(imageFile, watermarkOptions);
```

### Logo Watermark
```typescript
const watermarkOptions = {
  enabled: true,
  type: 'logo',
  logoFile: logoFile, // File object
  opacity: 0.4
};

const result = await applyWatermarkToImage(imageFile, watermarkOptions);
```

### In Image Upload Component
```typescript
// Enhanced upload with watermark
await uploadImage(event, editorRef, dbName, watermarkOptions);
```

## React Component Usage

```tsx
import WatermarkConfig from '@/components/dashboard/watermark/watermark_config';

function ImageEditor() {
  const [watermarkConfig, setWatermarkConfig] = useState({
    enabled: false,
    type: 'text',
    text: 'Sample Watermark',
    fontSize: 48,
    color: '#ffffff',
    opacity: 0.3
  });

  return (
    <div>
      <WatermarkConfig 
        onConfigChange={setWatermarkConfig}
        initialConfig={watermarkConfig}
      />
      {/* Your image upload component */}
    </div>
  );
}
```

## API Endpoints

### Generate Watermark
```bash
POST /api/watermark
Content-Type: multipart/form-data

# Form fields:
# - image: File (required)
# - watermark_type: "text" | "logo"
# - watermark_text: string
# - font_size: number
# - color: string
# - opacity: number
# - logo: File (for logo type)
```

### Health Check
```bash
GET /api/watermark
# Returns service status
```

## Features

### AI-Powered Placement
- Automatically analyzes image content
- Finds optimal watermark positions
- Avoids important visual elements

### Adaptive Settings
- Adjusts opacity based on image complexity
- Recommends colors based on image brightness
- Scales watermarks proportionally

### Supported Formats
- **Input**: JPEG, PNG, GIF
- **Output**: JPEG (high quality)
- **Logos**: PNG with transparency support

## Troubleshooting

### Service Not Available
```bash
# Check if service is running
curl http://localhost:5000/health

# Check Docker logs
docker-compose logs watermark-service
```

### Common Issues
1. **Port 5000 occupied**: Change PORT in docker-compose.yml
2. **Memory issues**: Reduce image size before processing
3. **Font errors**: Ensure container has required fonts

## Performance Tips

1. **Image Size**: Keep images under 5MB for best performance
2. **Batch Processing**: Process images individually for better memory management
3. **Service Scaling**: Use multiple service instances for high load

## Next Steps
- Integrate with your existing image upload workflow
- Customize watermark templates for your brand
- Set up monitoring and logging for production use