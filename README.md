# Cloudy - Currency Converter

A currency converter app built with Next.js, Prisma, and PostgreSQL. Deployed on AWS EC2 with RDS.

Cloudy © Komputasi Awan | Gasal 2025/2026

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (AWS RDS)
- **ORM**: Prisma
- **Exchange Rates**: exchangerate-api.com
- **Deployment**: Docker on AWS EC2

## Local Development

### Option 1: Without Docker (recommended for development)

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL and API key

# Start PostgreSQL with Docker
docker run -d --name postgres-local -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=pass123 -e POSTGRES_DB=currency_converter -p 5433:5432 postgres:15-alpine

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run development server
npm run dev
```

### Option 2: Full Docker Stack

```bash
# Setup environment
cp .env.example .env
# Edit .env:
# DATABASE_URL="postgresql://postgres:localpassword@db:5432/currency_converter"
# EXCHANGE_RATE_API_KEY="your_api_key"

# Build and run
docker-compose up -d --build

# Push database schema
docker-compose exec app npx prisma db push
```

Open [http://localhost:3000](http://localhost:3000)

## AWS Deployment Guide

### Step 1: Create RDS PostgreSQL Instance

1. Go to AWS RDS Console
2. Click "Create database"
3. Choose:
   - Engine: PostgreSQL
   - Template: Free tier (for testing)
   - DB instance identifier: `cloudy-db`
   - Master username: `postgres`
   - Master password: (set a strong password)
   - DB instance class: `db.t3.micro`
   - Storage: 20 GB
4. Connectivity:
   - VPC: Default VPC
   - Public access: Yes (for initial setup, secure later)
   - Security group: Create new
5. Database name: `currency_converter`
6. Click "Create database"
7. Wait for the instance to be available and note the endpoint

### Step 2: Configure Security Group for RDS

1. Go to EC2 → Security Groups
2. Find the RDS security group
3. Add inbound rule:
   - Type: PostgreSQL
   - Port: 5432
   - Source: Your EC2 security group ID

### Step 3: Setup EC2 Ubuntu Instance

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose-v2
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# IMPORTANT: Log out and back in for group changes
exit
# SSH back in

# Verify Docker
docker --version
docker compose version
```

### Step 4: Deploy Application

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/currency-converter.git
cd currency-converter

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_RDS_ENDPOINT:5432/currency_converter"
EXCHANGE_RATE_API_KEY="c5c153cfed904ecfa22ac19e"
EOF

# Build and run with Docker (production mode)
docker compose -f docker-compose.prod.yml up -d --build

# Initialize database schema
docker compose -f docker-compose.prod.yml exec app npx prisma db push

# Check logs
docker compose -f docker-compose.prod.yml logs -f
```

### Step 5: Configure EC2 Security Group

Add inbound rules:
- Type: HTTP, Port: 80, Source: 0.0.0.0/0
- Type: Custom TCP, Port: 3000, Source: 0.0.0.0/0

### Step 6: Access Your App

Open in browser: `http://YOUR_EC2_PUBLIC_IP:3000`

## Optional: Setup Nginx Reverse Proxy

```bash
sudo apt install nginx -y

sudo tee /etc/nginx/sites-available/cloudy << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/cloudy /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## Useful Commands

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f app

# Restart application
docker compose -f docker-compose.prod.yml restart app

# Rebuild and redeploy
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# Access container shell
docker compose -f docker-compose.prod.yml exec app sh

# Check database connection
docker compose -f docker-compose.prod.yml exec app npx prisma db push
```

## Project Structure

```
currency-converter/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── convert/route.ts    # POST /api/convert
│   │   │   └── history/route.ts    # GET /api/history
│   │   ├── converter/page.tsx      # Converter page
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # Homepage
│   ├── components/
│   │   └── Navbar.tsx
│   ├── context/
│   │   └── ThemeContext.tsx
│   └── lib/
│       ├── currency.ts             # Exchange rate API
│       └── prisma.ts               # Prisma client
├── prisma/
│   └── schema.prisma
├── Dockerfile
├── docker-compose.yml              # Development (with local DB)
├── docker-compose.prod.yml         # Production (with RDS)
└── package.json
```
