# 🔑 API Keys and Configuration Needed

## Required API Keys

### 1. Replicate API Token (REQUIRED for AI Mode)

**Why:** The AI image generation feature uses Replicate's Stable Diffusion models to create photorealistic hijab try-on images.

**How to Get:**
1. Go to [https://replicate.com](https://replicate.com)
2. Sign up for a free account
3. Navigate to [API Tokens](https://replicate.com/account/api-tokens)
4. Click "Create token"
5. Copy the token (starts with `r8_...`)

**Cost:** 
- Free tier: Limited credits
- Paid: ~$0.01-0.05 per image generation
- Recommended: Start with free tier for testing

**Where to Add:**
- Create a `.env` file in the root directory
- Add: `REPLICATE_API_TOKEN=r8_your_token_here`

---

## Optional Configuration

### 2. Database (Optional - SQLite works for development)

**For Production/Advanced Use:**
- PostgreSQL database recommended
- Free options: Supabase, Railway, Render
- Set `DATABASE_URL` in `.env` file

**Format:**
```
DATABASE_URL=postgresql://user:password@host:port/database
```

**Default:** SQLite (no setup needed, works out of the box)

---

## Environment Setup

### Step 1: Create `.env` file in root directory

```bash
cd "/Users/shaheersaud/hijab tryon"
touch .env
```

### Step 2: Add your Replicate API token

Edit `.env` and add:
```env
REPLICATE_API_TOKEN=r8_your_actual_token_here
BACKEND_URL=http://localhost:8000
DATABASE_URL=sqlite:///./hijab_tryon.db
```

### Step 3: Create `frontend/.env.local`

```bash
cd frontend
touch .env.local
```

Add:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

---

## Testing Without API Key

**What Works:**
- ✅ Landing page
- ✅ AR Mode (camera try-on)
- ✅ Brand Dashboard
- ✅ All UI components

**What Doesn't Work:**
- ❌ AI Mode image generation (will show error message)

---

## Quick Start Commands

Once you have your Replicate API token:

1. **Add to `.env` file:**
   ```bash
   echo "REPLICATE_API_TOKEN=r8_your_token" >> .env
   ```

2. **Start backend:**
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload
   ```

3. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Test AI mode:**
   - Go to http://localhost:3000/ai-mode
   - Upload a photo
   - Select a style
   - Click "Generate Try-On"

---

## Troubleshooting

**Error: "Replicate API token not configured"**
- Check that `.env` file exists in root directory
- Verify token is correctly formatted (starts with `r8_`)
- Restart backend server after adding token

**Error: "Insufficient credits"**
- Check your Replicate account balance
- Free tier has limited credits
- Upgrade to paid plan for production use

---

## Security Notes

⚠️ **Never commit `.env` files to git!**
- `.env` is already in `.gitignore`
- Keep your API tokens private
- Use different tokens for development and production

---

**Ready to go!** Once you add your Replicate API token, the full platform will be functional! 🚀

