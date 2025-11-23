# Troubleshooting Guide - ATT Application

Common issues and solutions for the Attention Training Technique application.

---

## 🚨 404: NOT_FOUND Error on Vercel/Deployment

### Symptom
```
404: NOT_FOUND
Code: NOT_FOUND
ID: cdg1::x6nsb-1763899155248-eac7f8fcda89
```

### Cause
This error typically occurs when:
1. The build failed but deployment succeeded
2. Missing dependencies
3. Next.js configuration issues
4. Missing required files

### Solution

#### Step 1: Check Build Logs

1. Go to your Vercel dashboard
2. Click on your deployment
3. Go to the "Build Logs" tab
4. Look for errors in the build process

#### Step 2: Verify Local Build

Test the build locally before deploying:

```bash
# Clean install
rm -rf node_modules .next package-lock.json
npm install

# Try building
npm run build

# If build succeeds, test it
npm run start
```

If the build fails locally, check the error messages.

#### Step 3: Common Fixes

**Fix 1: Missing Dependencies**
```bash
npm install --legacy-peer-deps
```

**Fix 2: Clear Vercel Cache**
In Vercel dashboard:
- Settings → General → Clear Cache
- Redeploy

**Fix 3: Environment Variables**
Ensure these are set in Vercel:
- Go to Settings → Environment Variables
- Add: `NODE_VERSION` = `18.x`

**Fix 4: Check vercel.json**
Ensure `vercel.json` exists in root:
```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs"
}
```

#### Step 4: Check Audio Files

**Important**: Audio files are NOT required for the app to build and deploy. The app will run without them but won't play sounds.

To add audio files after deployment:
1. Add files to `/public/sounds/`
2. Commit and push
3. Redeploy

---

## 🎧 Audio Files Not Loading

### Symptom
```
GET /sounds/breath.mp3 404 (Not Found)
```

### Solution

#### Option 1: Add Audio Files Locally

1. Create directory:
   ```bash
   mkdir -p public/sounds
   ```

2. Add 9 required files:
   - breath.mp3
   - heartbeat.mp3
   - white-noise.mp3
   - clock-tick.mp3
   - water-drip.mp3
   - fan-hum.mp3
   - bird-distant.mp3
   - traffic-distant.mp3
   - wind-distant.mp3

3. See `public/sounds/README.md` for sourcing instructions

#### Option 2: Generate Test Audio

Use Python to generate test tones:

```python
import numpy as np
from scipy.io import wavfile

def generate_tone(filename, frequency, duration=30):
    sample_rate = 44100
    t = np.linspace(0, duration, int(sample_rate * duration))
    audio = np.sin(2 * np.pi * frequency * t)
    audio = (audio * 32767).astype(np.int16)
    wavfile.write(f'public/sounds/{filename}', sample_rate, audio)

# Generate all files
sounds = {
    'breath.wav': 100,
    'heartbeat.wav': 80,
    'white-noise.wav': 440,
    'clock-tick.wav': 800,
    'water-drip.wav': 600,
    'fan-hum.wav': 120,
    'bird-distant.wav': 1000,
    'traffic-distant.wav': 150,
    'wind-distant.wav': 200,
}

for filename, freq in sounds.items():
    generate_tone(filename, freq)
```

Then convert to MP3:
```bash
cd public/sounds
for file in *.wav; do
  ffmpeg -i "$file" -b:a 128k "${file%.wav}.mp3"
  rm "$file"
done
```

---

## 🔨 Build Errors

### TypeScript Errors

**Symptom:**
```
Type error: Cannot find module '@/types'
```

**Solution:**
```bash
# Check tsconfig.json paths are correct
cat tsconfig.json

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Type check
npm run type-check
```

### Module Not Found

**Symptom:**
```
Module not found: Can't resolve 'next'
```

**Solution:**
```bash
npm install next@latest react@latest react-dom@latest
```

### TailwindCSS Not Working

**Symptom:**
Styles not applying

**Solution:**
```bash
# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Restart dev server
npm run dev
```

---

## 🌐 Vercel Deployment Issues

### Build Succeeds but Site Shows 404

**Cause:** Next.js routing issue or missing pages

**Solution:**

1. Check that `src/app/page.tsx` exists
2. Verify file structure:
   ```
   src/
   └── app/
       ├── page.tsx
       ├── layout.tsx
       └── globals.css
   ```

3. Redeploy from scratch:
   ```bash
   vercel --prod --force
   ```

### Deployment Timeout

**Cause:** Build taking too long

**Solution:**

1. Optimize dependencies:
   ```bash
   npm prune
   ```

2. Increase timeout in `vercel.json`:
   ```json
   {
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/next",
         "config": {
           "maxDuration": 60
         }
       }
     ]
   }
   ```

### Function Size Limit Exceeded

**Cause:** Large dependencies

**Solution:**

1. Check bundle size:
   ```bash
   npm run build
   # Look for large files in output
   ```

2. Use dynamic imports for large components
3. Consider splitting into smaller functions

---

## 🔊 Audio Playback Issues

### No Sound During Session

**Symptoms:**
- Session runs but no audio plays
- Console shows no errors

**Solutions:**

1. **Check Browser Permissions:**
   - Chrome: Click lock icon → Site settings → Sound → Allow
   - Firefox: Click shield icon → Permissions → Autoplay → Allow
   - Safari: Preferences → Websites → Auto-Play → Allow

2. **Verify Audio Context:**
   - Open browser console (F12)
   - Check for "AudioContext" errors
   - Try different browser (Chrome recommended)

3. **Test Audio Files:**
   - Open `/sounds/breath.mp3` directly in browser
   - Verify file plays
   - Check file format (MP3 recommended)

4. **HTTPS Required:**
   - Some browsers require HTTPS for Web Audio API
   - Test on `localhost` or deployed HTTPS site
   - Don't test on HTTP in production

### Spatial Audio Not Working

**Symptom:** All sounds come from center

**Solution:**

1. **Use Headphones:** Stereo panning requires stereo output
2. **Check Audio Files:** Ensure mono or stereo (not multi-channel)
3. **Browser Support:** Update to latest browser version

---

## 💾 localStorage Issues

### Ratings Not Saving

**Symptom:** Session completes but no history shown

**Solutions:**

1. **Check Privacy Mode:**
   - Disable incognito/private browsing
   - Some browsers block localStorage in private mode

2. **Check Quota:**
   - Open console
   - Try: `localStorage.setItem('test', 'test')`
   - If error, storage is full or blocked

3. **Clear Storage:**
   ```javascript
   localStorage.clear()
   ```

4. **Browser Settings:**
   - Chrome: Settings → Privacy → Cookies → Allow
   - Firefox: Settings → Privacy → History → Custom → Accept cookies

---

## 🐛 Development Server Issues

### Port Already in Use

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use different port
PORT=3001 npm run dev
```

### Hot Reload Not Working

**Symptom:** Changes not reflecting in browser

**Solutions:**

1. **Hard Refresh:** Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

2. **Clear .next cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Disable Browser Cache:**
   - Open DevTools (F12)
   - Network tab → Disable cache (checkbox)

---

## 📱 Mobile/Tablet Issues

### Session Not Starting on Mobile

**Symptom:** Click "Start" but nothing happens

**Solutions:**

1. **Audio Autoplay Policy:**
   - Mobile browsers require user interaction
   - Ensure user clicks button (no auto-start)
   - Add explicit "Play Audio" button

2. **iOS Specific:**
   - Update iOS to latest version
   - Use Safari (best Web Audio support on iOS)
   - Disable Low Power Mode

3. **Android Specific:**
   - Use Chrome for Android
   - Enable "Media" permissions

### Fixation Point Too Small

**Solution:**

Edit `src/components/FixationPoint.tsx`:
```typescript
// Change size prop
<FixationPoint size={20} /> // Larger for mobile
```

---

## 🔍 Debugging Tips

### Enable Verbose Logging

Add to `next.config.js`:
```javascript
module.exports = {
  webpack: (config) => {
    config.stats = 'verbose';
    return config;
  }
}
```

### Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Check Network tab for failed requests

### Test in Different Browsers

| Browser | Web Audio | localStorage | Recommended |
|---------|-----------|--------------|-------------|
| Chrome | ✅ Excellent | ✅ Yes | ✅ Best |
| Firefox | ✅ Good | ✅ Yes | ✅ Good |
| Safari | ⚠️ Limited | ✅ Yes | ⚠️ OK |
| Edge | ✅ Excellent | ✅ Yes | ✅ Good |

### Common Console Errors

**Error:** `Uncaught (in promise) DOMException: play() failed`
**Solution:** User must interact with page before audio plays

**Error:** `AudioContext was not allowed to start`
**Solution:** Create AudioContext after user gesture (click)

**Error:** `Failed to load resource: 404`
**Solution:** Audio file missing, check `/public/sounds/`

---

## 🚀 Performance Issues

### Session Lags or Freezes

**Solutions:**

1. **Reduce Audio Quality:**
   - Use 128kbps MP3 instead of 320kbps
   - Shorter files (30s instead of 60s)

2. **Close Other Tabs:**
   - Web Audio API is CPU intensive
   - Close unnecessary browser tabs

3. **Update Browser:**
   - Ensure latest version
   - Clear browser cache

### High Memory Usage

**Solutions:**

1. **Check for Memory Leaks:**
   - Open DevTools → Memory
   - Take heap snapshot
   - Complete session
   - Take another snapshot
   - Compare (should be similar)

2. **Audio Engine Disposal:**
   - Verify `audioEngine.dispose()` is called
   - Check session cleanup in `SessionManager`

---

## 📞 Getting Help

If you're still stuck after trying these solutions:

1. **Check the Documentation:**
   - `README.md` - Overview and setup
   - `DEPLOYMENT.md` - Deployment guide
   - `GETTING_STARTED.md` - Quick start
   - `public/sounds/README.md` - Audio setup

2. **Search Issues:**
   - GitHub Issues: Check if someone else had the same problem

3. **Create an Issue:**
   - Include error messages
   - Browser and version
   - Steps to reproduce
   - Screenshots if applicable

4. **Test Environment:**
   - Node.js version: `node --version`
   - npm version: `npm --version`
   - Operating system
   - Browser and version

---

## ✅ Quick Checklist

Before asking for help, verify:

- [ ] Ran `npm install`
- [ ] Ran `npm run build` successfully
- [ ] Audio files in `/public/sounds/` (or aware they're missing)
- [ ] Using modern browser (Chrome/Firefox/Edge)
- [ ] Not in private/incognito mode
- [ ] HTTPS enabled (for production)
- [ ] Checked browser console for errors
- [ ] Tried different browser
- [ ] Cleared browser cache
- [ ] Read error message carefully

---

## 🔄 Reset Everything

If all else fails, complete reset:

```bash
# Stop dev server (Ctrl+C)

# Remove everything
rm -rf node_modules .next package-lock.json

# Fresh install
npm install

# Try dev
npm run dev

# If dev works, try build
npm run build
npm run start
```

---

**Still having issues?** Check the main documentation or create a GitHub issue with:
- Error message
- Steps to reproduce
- Environment details (OS, browser, Node version)
- What you've already tried

Good luck! 🚀
