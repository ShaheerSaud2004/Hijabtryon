# Virtual Hijab Try-On Platform - Setup Guide

## 🚀 Quick Start

This is a fully functional B2B SaaS platform for virtual hijab try-on with dual-mode technology (AR + AI).

## 📋 Prerequisites

- Node.js 18+ installed
- Python 3.10+ installed
- npm or yarn package manager
- A Replicate API account (for AI generation)

## 🔑 Required API Keys

### 1. Replicate API Token (Required for AI Mode)

1. Go to [https://replicate.com](https://replicate.com)
2. Sign up for an account
3. Navigate to [API Tokens](https://replicate.com/account/api-tokens)
4. Create a new API token
5. Copy the token

### 2. Optional: Database Setup

- **For Development:** SQLite is used by default (no setup needed)
- **For Production:** PostgreSQL recommended
  - Set `DATABASE_URL` in `.env` file
  - Format: `postgresql://user:password@localhost:5432/hijab_tryon`

## 🛠️ Installation Steps

### Step 1: Clone and Navigate

```bash
cd "/Users/shaheersaud/hijab tryon"
```

### Step 2: Set Up Backend

```bash
cd backend

# Create virtual environment (if not already created)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies (if not already installed)
pip install -r requirements.txt
```

### Step 3: Set Up Frontend

```bash
cd ../frontend

# Install dependencies (if not already installed)
npm install
```

### Step 4: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Replicate API token:
```
REPLICATE_API_TOKEN=your_actual_token_here
```

3. Edit `frontend/.env.local` (create if it doesn't exist):
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Step 5: Initialize Database (Optional)

```bash
cd backend
source venv/bin/activate
python -c "from database import init_db; init_db()"
```

## 🚀 Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

The backend will be available at: `http://localhost:8000`

### Terminal 2: Start Frontend Server

```bash
cd frontend
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## 📱 Using the Application

1. **Landing Page** (`http://localhost:3000`)
   - Introduction to the platform
   - Competitive advantages
   - Feature comparison

2. **AR Mode** (`http://localhost:3000/ar-mode`)
   - Real-time camera try-on
   - Select different hijab styles
   - Works best with good lighting

3. **AI Mode** (`http://localhost:3000/ai-mode`)
   - Upload a photo
   - Select hijab style and color
   - Generate photorealistic try-on image
   - Requires Replicate API token

4. **Brand Dashboard** (`http://localhost:3000/dashboard`)
   - Manage hijab styles
   - Add colors and fabrics
   - Upload fabric textures

## 🔧 Troubleshooting

### Camera Not Working (AR Mode)
- Ensure you've granted camera permissions in your browser
- Try using HTTPS (required for camera access in production)
- Check browser console for errors

### AI Generation Failing
- Verify your Replicate API token is correct
- Check that you have credits in your Replicate account
- Review backend logs for error messages

### Backend Connection Issues
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify `NEXT_PUBLIC_BACKEND_URL` in frontend `.env.local`

## 📦 Project Structure

```
hijab-tryon/
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js app directory
│   │   ├── page.tsx      # Landing page
│   │   ├── ar-mode/      # AR try-on page
│   │   ├── ai-mode/      # AI generation page
│   │   └── dashboard/    # Brand dashboard
│   ├── components/       # React components
│   └── lib/              # Utility libraries
├── backend/              # FastAPI backend
│   ├── main.py          # Main API server
│   ├── models.py        # Database models
│   └── database.py      # Database configuration
└── docs/                # Documentation
```

## 🎯 Features Implemented

✅ Landing page with product introduction
✅ AR mode with MediaPipe face tracking
✅ AI mode with Replicate integration
✅ Brand dashboard for style management
✅ Backend API with FastAPI
✅ Database models for brands and styles
✅ Responsive design
✅ Modern UI with Tailwind CSS

## 🚧 Next Steps (Optional Enhancements)

- [ ] Add user authentication
- [ ] Implement Shopify integration
- [ ] Add payment processing
- [ ] Enhance AI generation with ControlNet
- [ ] Add face identity preservation
- [ ] Implement image storage (AWS S3)
- [ ] Add analytics dashboard
- [ ] Create Shopify app

## 📞 Support

If you encounter any issues:
1. Check the console logs (browser and terminal)
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Review the error messages for specific guidance

## 💰 Cost Estimates

- **Replicate API:** ~$0.01-0.05 per AI-generated image
- **Hosting (Vercel):** Free tier available
- **Backend (Railway/Render):** $5-20/month
- **Database (PostgreSQL):** $5-10/month (or free with Supabase)

---

**Ready to launch!** 🎉

