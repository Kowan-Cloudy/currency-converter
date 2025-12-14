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

```bash
# Install dependencies
npm install

# Setup environment
echo DATABASE_URL="postgresql://postgres:localpassword@db:5432/currency_converter" > .env
echo EXCHANGE_RATE_API_KEY="c5c153cfed904ecfa22ac19e" >> .env

# Build and run
docker-compose up -d --build

# Push database schema
docker-compose exec -u root app npx prisma db push
```

Open [http://localhost:3000](http://localhost:3000)

## AWS Deployment Commands
```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2

sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

git clone https://github.com/Kowan-Cloudy/currency-converter.git

cd currency-converter

# for replication purposes, get your own exchangerate-api.com api key
cat > .env << EOF
DATABASE_URL="postgresql://postgres:localpassword@db:5432/currency_converter"
EXCHANGE_RATE_API_KEY="c5c153cfed904ecfa22ac19e"
EOF

docker compose up -d --build

docker compose exec -u root app npx prisma db push

sudo apt install -y nginx

sudo tee /etc/nginx/sites-available/cloudy << 'EOF'
server {
    listen 80;
    server_name _;

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