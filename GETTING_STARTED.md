# Getting Started with ATT Application

Quick guide to get the Attention Training Technique application running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- A modern web browser
- Audio files (or use placeholder tones for testing)

---

## Step 1: Install Dependencies

```bash
npm install
```

This installs Next.js, React, TypeScript, TailwindCSS, and other dependencies.

---

## Step 2: Set Up Audio Files

### Option A: Quick Test (Generate Simple Tones)

Create a simple script to generate test audio files:

```bash
mkdir -p public/sounds
```

Then create this Python script `generate_test_audio.py`:

```python
import numpy as np
from scipy.io import wavfile

def generate_tone(filename, frequency, duration=30):
    sample_rate = 44100
    t = np.linspace(0, duration, int(sample_rate * duration))

    # Generate sine wave
    audio = np.sin(2 * np.pi * frequency * t)

    # Add fade in/out for smooth looping
    fade_samples = int(sample_rate * 0.5)  # 0.5s fade
    fade_in = np.linspace(0, 1, fade_samples)
    fade_out = np.linspace(1, 0, fade_samples)
    audio[:fade_samples] *= fade_in
    audio[-fade_samples:] *= fade_out

    # Convert to 16-bit PCM
    audio = (audio * 32767).astype(np.int16)

    wavfile.write(f'public/sounds/{filename}', sample_rate, audio)
    print(f'Created {filename}')

# Generate test tones at different frequencies
sounds = [
    ('breath.wav', 100),
    ('heartbeat.wav', 80),
    ('white-noise.wav', 440),
    ('clock-tick.wav', 800),
    ('water-drip.wav', 600),
    ('fan-hum.wav', 120),
    ('bird-distant.wav', 1000),
    ('traffic-distant.wav', 150),
    ('wind-distant.wav', 200),
]

for filename, freq in sounds:
    generate_tone(filename, freq)

print('All test audio files generated!')
```

Run it:
```bash
python3 generate_test_audio.py
```

Then convert WAV to MP3 (optional, for smaller file sizes):
```bash
# Using ffmpeg (install from https://ffmpeg.org/)
cd public/sounds
for file in *.wav; do
  ffmpeg -i "$file" -codec:a libmp3lame -b:a 128k "${file%.wav}.mp3"
  rm "$file"  # Remove WAV after conversion
done
```

### Option B: Use Real Audio (Recommended for Actual Use)

1. Visit https://freesound.org/
2. Download sounds matching these categories:
   - Internal: breath, heartbeat, white noise
   - Near: clock ticking, water dripping, fan humming
   - Far: distant birds, distant traffic, distant wind

3. Place in `public/sounds/` with exact names:
   ```
   public/sounds/
   ├── breath.mp3
   ├── heartbeat.mp3
   ├── white-noise.mp3
   ├── clock-tick.mp3
   ├── water-drip.mp3
   ├── fan-hum.mp3
   ├── bird-distant.mp3
   ├── traffic-distant.mp3
   └── wind-distant.mp3
   ```

See `public/sounds/README.md` for detailed instructions.

---

## Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Step 4: Test the Application

### Quick Test Checklist

1. **Landing Page**
   - [ ] Click "Begin ATT Session"

2. **Warning Screen**
   - [ ] Read the warning
   - [ ] Click "I Understand, Continue"

3. **Pre-Session Rating**
   - [ ] Select a rating (-3 to +3)
   - [ ] Click "Continue to Session"

4. **Session Initialization**
   - [ ] Check audio settings
   - [ ] Click "Start ATT Session"

5. **ATT Session (12 minutes)**
   - [ ] Verify fixation point appears
   - [ ] Verify sounds are playing
   - [ ] Verify instructions appear
   - [ ] Verify progress bar works
   - [ ] Wait for completion (or test for a few minutes)

6. **Post-Session Rating**
   - [ ] Select post-session rating
   - [ ] Click "View Results"

7. **Results**
   - [ ] Verify pre/post comparison shown
   - [ ] Check session statistics

---

## Troubleshooting

### Audio Files Not Loading

**Error**: `GET http://localhost:3000/sounds/breath.mp3 404 (Not Found)`

**Fix**:
1. Verify files are in `public/sounds/` directory
2. Check file names match exactly (case-sensitive)
3. Restart dev server: `Ctrl+C` then `npm run dev`

---

### Audio Not Playing

**Error**: Audio engine initializes but no sound

**Fix**:
1. Check browser console for errors
2. Verify audio files play in media player
3. Check browser audio permissions
4. Try different browser (Chrome recommended)
5. Ensure volume is not muted

---

### Build Errors

**Error**: TypeScript or build errors

**Fix**:
```bash
# Clear everything and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

## Next Steps

### For Development

1. **Customize Sounds**: Replace test tones with real audio
2. **Adjust Protocol**: Edit `src/session/attProtocol.ts` (maintain fidelity!)
3. **Add Features**: Track data, export sessions, etc.
4. **Deploy**: Follow `DEPLOYMENT.md` guide

### For Production Use

1. **Get Quality Audio**: See `public/sounds/README.md`
2. **Test Thoroughly**: Complete full 12-minute sessions
3. **Deploy**: Use Vercel for easiest deployment
4. **Monitor**: Check for errors in production

---

## Project Structure Quick Reference

```
src/
├── app/                 # Next.js pages
│   ├── page.tsx        # Landing page
│   ├── rating/pre/     # Pre-session rating
│   ├── session/        # ATT session
│   ├── rating/post/    # Post-session rating
│   └── results/        # Results display
│
├── components/          # React components
├── audio/              # Audio engine & sounds
├── session/            # Session management
├── utils/              # Storage & formatters
└── types/              # TypeScript types
```

---

## Key Files to Understand

1. **`src/session/attProtocol.ts`**
   - Protocol configuration
   - Phase timing and instructions
   - Switching intervals

2. **`src/audio/AudioEngine.ts`**
   - Web Audio API implementation
   - Spatial positioning
   - Playback control

3. **`src/session/SessionManager.ts`**
   - Orchestrates 3 phases
   - Event handling
   - Timing control

4. **`src/app/session/page.tsx`**
   - Main session UI
   - Fixation point display
   - Instruction overlay

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Run production build
npm run type-check       # Check TypeScript
npm run lint             # Run ESLint

# Deployment
vercel                   # Deploy to Vercel
npm run build && npm run start  # Test production locally
```

---

## Configuration

### Environment Variables (Optional)

Create `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SESSION_DURATION=720000  # 12 minutes in ms
```

### Customizing Protocol

**IMPORTANT**: Any changes should maintain fidelity to Wells' protocol!

To adjust timing (for testing only):

```typescript
// src/session/attProtocol.ts

// FOR TESTING ONLY - reduce to 1 minute total
const MINUTE = 10 * 1000;  // 10 seconds = 1 "minute" for testing

// PRODUCTION - use actual minutes
const MINUTE = 60 * 1000;  // 60 seconds = 1 minute
```

---

## Support Resources

- **Full Documentation**: See `README.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Audio Setup**: See `public/sounds/README.md`
- **Protocol Fidelity**: See `PROTOCOL_FIDELITY.md`

---

## Success Checklist

You're ready when:

- [x] Dependencies installed (`npm install` succeeded)
- [x] Audio files in `public/sounds/` (9 files)
- [x] Dev server running (`npm run dev` works)
- [x] Browser opens to http://localhost:3000
- [x] Complete test session works end-to-end
- [x] No console errors
- [x] Audio plays correctly
- [x] Ratings save and display

---

## Quick Start Script

Create `start.sh`:

```bash
#!/bin/bash

echo "ATT Application Quick Start"
echo "=========================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for audio files
SOUND_COUNT=$(ls -1 public/sounds/*.mp3 2>/dev/null | wc -l)
if [ "$SOUND_COUNT" -lt 9 ]; then
    echo "⚠️  Warning: Only $SOUND_COUNT/9 audio files found in public/sounds/"
    echo "   See public/sounds/README.md for instructions"
else
    echo "✅ Audio files found ($SOUND_COUNT/9)"
fi

# Start dev server
echo "🚀 Starting development server..."
npm run dev
```

Make executable and run:
```bash
chmod +x start.sh
./start.sh
```

---

## That's It!

You should now have a fully functional ATT application running locally.

**Next**: Replace test audio with quality recordings and deploy to production!

For detailed information, see:
- `README.md` - Complete documentation
- `DEPLOYMENT.md` - Production deployment
- `PROTOCOL_FIDELITY.md` - Scientific accuracy

**Questions?** Check the troubleshooting sections in each guide.
