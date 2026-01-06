# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Backend API
BACKEND_URL=http://localhost:8000

# Replicate API (for AI image generation)
# Get your API key from: https://replicate.com/account/api-tokens
REPLICATE_API_TOKEN=your_replicate_api_token_here

# Database (optional - defaults to SQLite)
# For PostgreSQL: postgresql://user:password@localhost:5432/hijab_tryon
DATABASE_URL=sqlite:///./hijab_tryon.db

# Frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Also create `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

