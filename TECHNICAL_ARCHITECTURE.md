# Technical Architecture Overview

## 🏗️ System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER (Browser/Mobile)                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │      Frontend (Next.js)       │
        │  - Camera Access              │
        │  - UI Components              │
        │  - AR Canvas                  │
        └───────┬───────────────┬───────┘
                │               │
        ┌───────▼───────┐  ┌───▼──────────────┐
        │   AR MODE     │  │   AI MODE        │
        │               │  │                  │
        │ 1. Face Track │  │ 1. Upload Photo  │
        │ 2. Segment    │  │ 2. Process       │
        │ 3. Render     │  │ 3. Generate      │
        │ 4. Display    │  │ 4. Return Image  │
        └───────┬───────┘  └───┬──────────────┘
                │               │
                │               │
        ┌───────▼───────────────▼───────┐
        │    Backend API (FastAPI)      │
        │  - Image Processing           │
        │  - Request Routing            │
        │  - Brand Data Management      │
        └───────┬───────────────────────┘
                │
        ┌───────▼───────────────────────┐
        │    AI Service (Replicate)      │
        │  - Stable Diffusion XL         │
        │  - ControlNet                  │
        │  - Face Restoration            │
        └───────────────────────────────┘
```

---

## 🔄 AR Mode Flow (Real-Time)

```
Camera Feed
    │
    ▼
MediaPipe Face Mesh
    │
    ├─► Face Landmarks (468 points)
    ├─► Head Pose (rotation, position)
    └─► Face Detection
    │
    ▼
MediaPipe Selfie Segmentation
    │
    ├─► Head Mask
    ├─► Hair Mask
    └─► Background Mask
    │
    ▼
Hijab Rendering Engine
    │
    ├─► Load Hijab Texture (from brand)
    ├─► Warp to Face Pose
    ├─► Apply Occlusion (behind chin)
    ├─► Add Drape Layers
    └─► Match Lighting
    │
    ▼
Canvas/WebGL Output
    │
    ▼
Display (30fps target)
```

---

## 🎨 AI Generation Mode Flow

```
User Uploads Selfie
    │
    ▼
Preprocessing
    │
    ├─► Face Detection (InsightFace)
    ├─► Face Alignment
    ├─► Segmentation (head/hair region)
    └─► Extract Face Embedding
    │
    ▼
Stable Diffusion Pipeline
    │
    ├─► ControlNet (preserve pose/structure)
    ├─► Inpainting (replace head region)
    ├─► Prompt Engineering
    │   └─► "wearing [fabric] hijab in [color]..."
    └─► Face Identity Preservation
    │
    ▼
Post-Processing
    │
    ├─► Face Restoration (if needed)
    ├─► Color Correction
    └─► Quality Check
    │
    ▼
Return Generated Image
    │
    ▼
Display to User
```

---

## 📦 Component Breakdown

### **1. Frontend (Next.js)**

**Files Structure:**
```
frontend/
├── app/
│   ├── page.tsx              # Main page
│   ├── ar-mode/
│   │   └── page.tsx          # AR try-on
│   └── ai-mode/
│       └── page.tsx          # AI generation
├── components/
│   ├── Camera.tsx            # Camera access
│   ├── ARRenderer.tsx        # AR rendering logic
│   ├── HijabSelector.tsx     # Style/color picker
│   ├── ImageUpload.tsx       # Photo upload
│   └── Preview.tsx           # Result display
├── lib/
│   ├── mediapipe.ts          # Face tracking setup
│   ├── segmentation.ts      # Masking logic
│   └── rendering.ts          # Hijab rendering
└── hooks/
    └── useAR.ts              # AR state management
```

**Key Technologies:**
- `@mediapipe/face_mesh` - Face tracking
- `@mediapipe/selfie_segmentation` - Masking
- `three.js` or Canvas API - Rendering
- `next/image` - Image handling

---

### **2. Backend API (Python FastAPI)**

**Files Structure:**
```
backend/
├── main.py                   # FastAPI app
├── routes/
│   ├── ar.py                 # AR endpoints
│   ├── ai.py                 # AI generation
│   └── brands.py             # Brand management
├── services/
│   ├── ai_service.py         # Replicate integration
│   ├── image_processor.py    # Image preprocessing
│   └── face_service.py       # Face detection
└── models/
    └── brand.py              # Brand data models
```

**Key Endpoints:**
```
POST /api/ai/generate
  - Input: image, hijab_style, color
  - Output: generated_image_url

GET /api/brands/{id}/styles
  - Output: available hijab styles

POST /api/brands/{id}/upload-style
  - Input: fabric_image, color_swatches
```

---

### **3. AR Engine**

**Core Functions:**
```typescript
// Face tracking
function trackFace(videoFrame) {
  return faceMesh.process(videoFrame);
}

// Segmentation
function segmentHead(videoFrame) {
  return selfieSegmentation.process(videoFrame);
}

// Hijab rendering
function renderHijab(faceData, hijabStyle, color) {
  // 1. Get head pose
  // 2. Warp hijab texture
  // 3. Apply occlusion
  // 4. Render to canvas
}
```

**Performance Targets:**
- 30fps on mid-range devices
- <50ms processing per frame
- Smooth head tracking

---

### **4. AI Generation Engine**

**Pipeline Steps:**
```python
def generate_hijab_image(selfie, hijab_style, color):
    # 1. Preprocess
    face_data = detect_face(selfie)
    mask = create_head_mask(selfie)
    
    # 2. Prepare prompt
    prompt = f"realistic photo of person wearing {hijab_style} hijab in {color}"
    
    # 3. Generate
    result = replicate.run(
        "stability-ai/sdxl:...",
        input={
            "image": selfie,
            "mask": mask,
            "prompt": prompt,
            "controlnet": "pose"
        }
    )
    
    # 4. Post-process
    final = restore_face(result, face_data)
    
    return final
```

**Model Choices:**
- **Base:** Stable Diffusion XL
- **Control:** ControlNet (pose/structure)
- **Face:** Face restoration model
- **Inpainting:** For head replacement

---

### **5. Brand Integration System**

**Data Model:**
```typescript
interface Brand {
  id: string;
  name: string;
  styles: HijabStyle[];
}

interface HijabStyle {
  id: string;
  name: string;
  fabric: string;  // "chiffon", "jersey", etc.
  colors: Color[];
  texture_image?: string;
  drape_pattern: string;
}
```

**Brand Dashboard:**
- Upload fabric photos
- Define color swatches
- Set drape patterns
- Preview on models

---

## 🔌 Integration Points

### **Shopify Integration**

**Shopify App Structure:**
```
shopify-app/
├── app/
│   └── pages/
│       └── index.tsx         # App home
├── extensions/
│   └── product-page/
│       └── TryOnButton.tsx   # Embedded component
└── webhooks/
    └── product-update.ts     # Sync products
```

**Embedding Flow:**
1. Brand installs Shopify app
2. App adds "Try It On" button to product pages
3. Button opens modal with your frontend
4. User tries on → sees result
5. Conversion tracked via Shopify API

---

## 🗄️ Data Flow

### **AR Mode (Client-Side)**
```
All processing happens in browser:
- Camera → MediaPipe → Rendering → Display
- No server calls needed
- Fast, but limited by device
```

### **AI Mode (Server-Side)**
```
Client → Backend → AI Service → Backend → Client
- Upload image
- Process on server
- Generate via Replicate
- Return result
- Slower, but higher quality
```

---

## 🔐 Security & Privacy

**Requirements:**
- ✅ No permanent storage of user photos
- ✅ Images deleted after generation
- ✅ HTTPS only
- ✅ CORS properly configured
- ✅ Rate limiting on API
- ✅ Clear AI disclosure

**Implementation:**
```python
# Temporary storage
image_id = generate_uuid()
store_temporarily(image, ttl=3600)  # 1 hour
# Auto-delete after TTL
```

---

## 📊 Performance Optimization

**AR Mode:**
- Use Web Workers for processing
- Reduce canvas resolution if needed
- Cache hijab textures
- Optimize MediaPipe settings

**AI Mode:**
- Queue system for requests
- Image compression before upload
- CDN for generated images
- Caching for common styles

---

## 🧪 Testing Strategy

**Unit Tests:**
- Face detection accuracy
- Segmentation quality
- Rendering performance

**Integration Tests:**
- End-to-end AR flow
- AI generation pipeline
- Shopify integration

**User Testing:**
- Different face shapes
- Various lighting conditions
- Multiple devices
- Cultural accuracy review

---

## 🚀 Deployment Architecture

```
┌─────────────────┐
│   Vercel        │  ← Frontend (Next.js)
│   (CDN)         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Railway       │  ← Backend API
│   (Backend)     │
└────────┬────────┘
         │
         ├──► Replicate (AI)
         ├──► AWS S3 (Storage)
         └──► PostgreSQL (Database)
```

---

**This architecture supports:**
- ✅ Scalable growth
- ✅ Separate concerns
- ✅ Easy updates
- ✅ Cost-effective MVP

