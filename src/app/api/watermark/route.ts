import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/route";

//==========================================
// Original Code (Preserved for Reference)
//==========================================
// This is a new file for watermark functionality

//------------------------------------------
// Purpose: API endpoint for AI-powered watermark generation
// Interfaces with Python watermark service
//------------------------------------------

interface WatermarkConfig {
  type: 'text' | 'logo';
  text?: string;
  font_size?: number;
  color?: string;
  opacity?: number;
  logo_data?: string;
}

interface WatermarkRequest {
  image_data: string;
  watermark_config: WatermarkConfig;
}

interface WatermarkResponse {
  success: boolean;
  watermarked_image?: string;
  error?: string;
  message?: string;
}

const WATERMARK_SERVICE_URL = process.env.WATERMARK_SERVICE_URL || 'http://localhost:5000';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication - simplified for now
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    const watermarkType = formData.get('watermark_type') as string || 'text';
    const watermarkText = formData.get('watermark_text') as string || '';
    const fontSize = parseInt(formData.get('font_size') as string || '48');
    const color = formData.get('color') as string || 'white';
    const opacity = parseFloat(formData.get('opacity') as string || '0.3');
    const logoFile = formData.get('logo') as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert image to base64
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    // Prepare watermark configuration
    const watermarkConfig: WatermarkConfig = {
      type: watermarkType as 'text' | 'logo',
      opacity: opacity
    };

    if (watermarkType === 'text') {
      watermarkConfig.text = watermarkText;
      watermarkConfig.font_size = fontSize;
      watermarkConfig.color = color;
    } else if (watermarkType === 'logo' && logoFile) {
      const logoBuffer = await logoFile.arrayBuffer();
      const logoBase64 = Buffer.from(logoBuffer).toString('base64');
      watermarkConfig.logo_data = logoBase64;
    }

    // Prepare request for Python service
    const requestData: WatermarkRequest = {
      image_data: imageBase64,
      watermark_config: watermarkConfig
    };

    // Call Python watermark service
    const response = await fetch(`${WATERMARK_SERVICE_URL}/watermark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Watermark service error" },
        { status: 500 }
      );
    }

    const result: WatermarkResponse = await response.json();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to generate watermark" },
        { status: 500 }
      );
    }

    // Return the watermarked image as base64
    return NextResponse.json({
      success: true,
      watermarked_image: result.watermarked_image,
      message: "Watermark applied successfully"
    });

  } catch (error) {
    // console.error("Watermark generation error:", error);
    return NextResponse.json(
      { error: "Internal server error during watermark generation" },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    // Check authentication - simplified for now
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Health check for watermark service
    const response = await fetch(`${WATERMARK_SERVICE_URL}/health`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Watermark service unavailable" },
        { status: 503 }
      );
    }

    const healthData = await response.json();
    
    return NextResponse.json({
      status: "healthy",
      watermark_service: healthData
    });

  } catch (error) {
    // console.error("Watermark service health check error:", error);
    return NextResponse.json(
      { error: "Failed to check watermark service health" },
      { status: 500 }
    );
  }
}