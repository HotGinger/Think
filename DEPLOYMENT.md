# ATT Application - Deployment Guide

Complete guide for deploying the Attention Training Technique application locally and to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Building for Production](#building-for-production)
4. [Deployment Options](#deployment-options)
5. [Environment Configuration](#environment-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: v18.0.0 or higher
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm** or **yarn** or **pnpm**
  - npm comes with Node.js
  - Yarn: `npm install -g yarn`
  - pnpm: `npm install -g pnpm`

- **Git** (for version control)
  - Download: https://git-scm.com/

### System Requirements

- **RAM**: 2GB minimum, 4GB recommended
- **Storage**: 500MB free space
- **Browser**: Modern browser with Web Audio API support
  - Chrome 66+
  - Firefox 61+
  - Safari 14+
  - Edge 79+

---

## Local Development

### 1. Clone or Download the Repository

```bash
# If using Git
git clone <repository-url>
cd att-application

# Or download and extract the ZIP file
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

This will install all required packages including:
- Next.js
- React
- TypeScript
- TailwindCSS
- Zustand

### 3. Add Audio Files

Before running the application, add audio files to `/public/sounds/`:

```bash
# Create sounds directory if it doesn't exist
mkdir -p public/sounds

# Add your 9 audio files (see /public/sounds/README.md for details)
# - breath.mp3
# - heartbeat.mp3
# - white-noise.mp3
# - clock-tick.mp3
# - water-drip.mp3
# - fan-hum.mp3
# - bird-distant.mp3
# - traffic-distant.mp3
# - wind-distant.mp3
```

See `/public/sounds/README.md` for detailed instructions on sourcing or generating audio files.

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will start at `http://localhost:3000`

### 5. Development Features

- **Hot Reload**: Changes automatically reflect in browser
- **TypeScript**: Real-time type checking
- **Error Overlay**: Detailed error messages in browser

---

## Building for Production

### 1. Type Check

```bash
npm run type-check
```

Ensures no TypeScript errors before building.

### 2. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### 3. Test Production Build Locally

```bash
npm run start
```

Runs the production build at `http://localhost:3000`

### 4. Build Output

- **Static assets**: Optimized and compressed
- **JavaScript**: Minified and code-split
- **CSS**: Minimized and purged
- **Images**: Optimized (if any)

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the company behind Next.js and offers the best integration.

#### A. Deploy from Git Repository

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to https://vercel.com
3. Click "New Project"
4. Import your Git repository
5. Vercel auto-detects Next.js configuration
6. Click "Deploy"

#### B. Deploy using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Important**: Upload audio files to `/public/sounds/` before deploying!

**Vercel Benefits:**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from Git
- ✅ Zero configuration

---

### Option 2: Netlify

1. Build the application:
   ```bash
   npm run build
   npm run export  # If using static export
   ```

2. Deploy to Netlify:

   **Via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy
   ```

   **Via Netlify UI:**
   - Go to https://app.netlify.com
   - Drag and drop the `out` folder (or `.next` for server-side)
   - Or connect your Git repository

**Configuration (netlify.toml):**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

### Option 3: Self-Hosted (VPS/Cloud Server)

#### Using Node.js Server

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Upload files to server:**
   - Upload entire project directory
   - Or use Git to clone on server

3. **Install dependencies on server:**
   ```bash
   npm install --production
   ```

4. **Run with PM2 (Process Manager):**
   ```bash
   # Install PM2
   npm install -g pm2

   # Start application
   pm2 start npm --name "att-app" -- start

   # Save PM2 configuration
   pm2 save

   # Setup auto-restart on server reboot
   pm2 startup
   ```

5. **Configure reverse proxy (nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

### Option 4: Static Export (GitHub Pages, S3, etc.)

**Note**: This option requires modifications as ATT uses some server-side features.

1. **Modify `next.config.js`:**
   ```javascript
   module.exports = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   }
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy the `out` directory:**
   - GitHub Pages: Push to `gh-pages` branch
   - AWS S3: Upload to S3 bucket
   - Any static hosting service

---

### Option 5: Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   # Build the application
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   # Production image
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs
   EXPOSE 3000
   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Build and run:**
   ```bash
   docker build -t att-app .
   docker run -p 3000:3000 att-app
   ```

---

## Environment Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SESSION_DURATION=720000  # 12 minutes in ms

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Sentry Error Tracking (optional)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Production Environment Variables

For production deployment, set these in your hosting platform's dashboard:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment
- **Custom Server**: Use `.env.production` or system environment

---

## Post-Deployment Checklist

### Essential Checks

- [ ] All audio files are accessible at `/sounds/` paths
- [ ] Audio files play correctly in browser
- [ ] HTTPS is configured (required for audio autoplay in some browsers)
- [ ] Test complete session flow (landing → rating → session → results)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Verify localStorage is working (ratings saved)
- [ ] Check console for errors
- [ ] Verify spatial audio positioning works

### Performance Optimization

- [ ] Enable caching for audio files
- [ ] Use CDN for audio delivery (optional)
- [ ] Enable gzip/brotli compression
- [ ] Verify assets are minified
- [ ] Test page load speed

### Security

- [ ] HTTPS enabled
- [ ] Content Security Policy headers configured
- [ ] No sensitive data in localStorage
- [ ] Audio files served with correct MIME types

---

## Troubleshooting

### Audio Files Not Loading

**Problem**: Audio files return 404 errors

**Solutions**:
1. Verify files are in `/public/sounds/` directory
2. Check file names match exactly (case-sensitive)
3. Clear browser cache
4. Check network tab in DevTools

---

### Audio Not Playing

**Problem**: Audio engine initializes but no sound

**Solutions**:
1. Check browser audio permissions
2. Verify volume is not muted
3. Test in different browser
4. Check browser console for Web Audio API errors
5. Ensure HTTPS (required for some browsers)

---

### Build Errors

**Problem**: Build fails with TypeScript errors

**Solutions**:
```bash
# Check for type errors
npm run type-check

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

### Deployment to Vercel Fails

**Problem**: Deployment succeeds but app doesn't work

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify Node.js version matches (`engines` in package.json)
3. Ensure all audio files are committed to Git
4. Check environment variables are set

---

### localStorage Not Working

**Problem**: Ratings not saved between sessions

**Solutions**:
1. Check browser privacy settings
2. Verify not in private/incognito mode
3. Check for localStorage quota errors in console
4. Test in different browser

---

## Performance Optimization

### Audio File Optimization

1. **Compress audio files**:
   ```bash
   # Using ffmpeg
   ffmpeg -i input.wav -c:a libmp3lame -b:a 128k output.mp3
   ```

2. **Use appropriate formats**:
   - MP3: Best browser compatibility
   - OGG: Smaller size, good quality
   - WAV: Largest size, best quality (not recommended)

3. **Implement lazy loading** (if needed):
   - Load only essential sounds initially
   - Load additional sounds during pre-session screen

### Caching Strategy

Add to `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/sounds/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

---

## Monitoring & Analytics

### Google Analytics (Optional)

1. Install package:
   ```bash
   npm install @next/third-parties
   ```

2. Add to `app/layout.tsx`:
   ```tsx
   import { GoogleAnalytics } from '@next/third-parties/google'

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>{children}</body>
         <GoogleAnalytics gaId="G-XXXXXXXXXX" />
       </html>
     )
   }
   ```

### Error Tracking with Sentry (Optional)

1. Install Sentry:
   ```bash
   npm install @sentry/nextjs
   ```

2. Configure as per Sentry documentation

---

## Scaling Considerations

For high-traffic deployments:

1. **Use CDN** for audio files (CloudFlare, AWS CloudFront)
2. **Implement rate limiting** to prevent abuse
3. **Add monitoring** (Uptime checks, error tracking)
4. **Consider serverless** functions for API routes
5. **Optimize bundle size** using dynamic imports

---

## Support

For issues or questions:

1. Check browser console for errors
2. Review `/public/sounds/README.md` for audio setup
3. Verify all deployment steps completed
4. Test in different browsers/devices

---

## License

This application is for research and educational purposes. Based on the ATT protocol from Adrian Wells' *Metacognitive Therapy for Anxiety and Depression* (Guilford Press, 2009).

Not a substitute for professional mental health care.
