//==========================================
// Original Code (Preserved for Reference)
//==========================================
// This is a new file for watermark integration

//------------------------------------------
// Purpose: Utility functions for integrating AI watermark generation
// into the existing image upload workflow
//------------------------------------------

interface WatermarkOptions {
  enabled: boolean;
  type: 'text' | 'logo';
  text?: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  logoFile?: File;
}

interface WatermarkResult {
  success: boolean;
  watermarkedImageData?: string;
  error?: string;
}

/**
 * #------------------------------------------
 * # Purpose: Apply watermark to an image file using the AI watermark service
 * #------------------------------------------
 */
export async function applyWatermarkToImage(
  imageFile: File,
  options: WatermarkOptions
): Promise<WatermarkResult> {
  if (!options.enabled) {
    return { success: true };
  }

  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('watermark_type', options.type);
    formData.append('opacity', (options.opacity || 0.3).toString());

    if (options.type === 'text') {
      formData.append('watermark_text', options.text || 'Watermark');
      formData.append('font_size', (options.fontSize || 48).toString());
      formData.append('color', options.color || 'white');
    } else if (options.type === 'logo' && options.logoFile) {
      formData.append('logo', options.logoFile);
    }

    const response = await fetch('/api/watermark', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error };
    }

    const result = await response.json();
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      watermarkedImageData: result.watermarked_image
    };

  } catch (error) {
    // console.error('Watermark application error:', error);
    return { success: false, error: 'Failed to apply watermark' };
  }
}

/**
 * #------------------------------------------
 * # Purpose: Convert base64 image data back to File object
 * #------------------------------------------
 */
export function base64ToFile(base64Data: string, filename: string, mimeType: string): File {
  // Remove data URL prefix if present
  const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
  
  // Convert base64 to bytes
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  
  return new File([byteArray], filename, { type: mimeType });
}

/**
 * #------------------------------------------
 * # Purpose: Check if watermark service is available
 * #------------------------------------------
 */
export async function checkWatermarkServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch('/api/watermark');
    return response.ok;
  } catch (error) {
    // console.error('Watermark service health check failed:', error);
    return false;
  }
}

/**
 * #------------------------------------------
 * # Purpose: Get default watermark settings based on image analysis
 * #------------------------------------------
 */
export async function getWatermarkRecommendations(imageFile: File): Promise<unknown> {
  try {
    // Convert image to base64 for analysis
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const response = await fetch(`${process.env.WATERMARK_SERVICE_URL || 'http://localhost:5000'}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_data: imageBase64 })
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.recommendations;

  } catch (error) {
    // console.error('Error getting watermark recommendations:', error);
    return null;
  }
}