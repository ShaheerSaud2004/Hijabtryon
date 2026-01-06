from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import replicate
import os
from dotenv import load_dotenv
import io
from PIL import Image
import base64

load_dotenv()

app = FastAPI(title="Hijab Try-On API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:4823"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Replicate client
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
if REPLICATE_API_TOKEN:
    replicate_client = replicate.Client(api_token=REPLICATE_API_TOKEN)
else:
    replicate_client = None
    print("Warning: REPLICATE_API_TOKEN not set. AI generation will not work.")

@app.get("/")
async def root():
    return {"message": "Hijab Try-On API", "status": "running"}

@app.get("/api/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/ai/generate")
async def generate_hijab_image(
    image: UploadFile = File(...),
    style: str = Form(...),
    color: str = Form(...),
    fabric: str = Form(...)
):
    """
    Generate a hijab try-on image using AI
    """
    if not replicate_client:
        raise HTTPException(
            status_code=500,
            detail="Replicate API token not configured. Please set REPLICATE_API_TOKEN in your environment variables."
        )
    
    try:
        # Read and validate image
        image_data = await image.read()
        img = Image.open(io.BytesIO(image_data))
        
        # Convert to base64 for Replicate
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        img_data_url = f"data:image/png;base64,{img_base64}"
        
        # Create prompt for hijab generation
        prompt = f"realistic photo of a person wearing a {fabric} hijab in {color} color, {style} style, professional photography, high quality, detailed, modesty compliant, full head coverage, natural lighting"
        
        # Use Stable Diffusion XL for generation
        # Note: This is a simplified version. In production, you'd use ControlNet for better face preservation
        output = replicate_client.run(
            "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            input={
                "prompt": prompt,
                "image": img_data_url,
                "num_outputs": 1,
                "guidance_scale": 7.5,
                "num_inference_steps": 50,
            }
        )
        
        # Download the generated image
        if isinstance(output, list) and len(output) > 0:
            image_url = output[0]
            
            # Fetch the image
            try:
                import httpx
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.get(image_url)
                    response.raise_for_status()
                    image_bytes = response.content
            except ImportError:
                # Fallback if httpx not available
                import urllib.request
                with urllib.request.urlopen(image_url) as response:
                    image_bytes = response.read()
            
            return StreamingResponse(
                io.BytesIO(image_bytes),
                media_type="image/png",
                headers={"Content-Disposition": "attachment; filename=hijab-tryon.png"}
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to generate image")
            
    except Exception as e:
        print(f"Error generating image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")

@app.get("/api/brands")
async def get_brands():
    """Get all brands"""
    # TODO: Implement database query
    return {"brands": []}

@app.get("/api/brands/{brand_id}/styles")
async def get_brand_styles(brand_id: str):
    """Get hijab styles for a brand"""
    # TODO: Implement database query
    return {"styles": []}

@app.post("/api/brands/{brand_id}/styles")
async def create_brand_style(
    brand_id: str,
    name: str = Form(...),
    color: str = Form(...),
    fabric: str = Form(...)
):
    """Create a new hijab style for a brand"""
    # TODO: Implement database save
    return {"message": "Style created", "style_id": "new_style_id"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

