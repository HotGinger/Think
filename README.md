# ATT Application - Attention Training Technique

A scientifically faithful web-based implementation of the **Attention Training Technique (ATT)** from Adrian Wells' Metacognitive Therapy protocol.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/license-Educational-green)

---

## 🎯 Overview

This application implements the complete 12-minute Attention Training Technique exactly as described in:

> Wells, A. (2009). *Metacognitive Therapy for Anxiety and Depression*. Guilford Press. (Chapter 4)

ATT is **NOT** relaxation training, meditation, or a coping strategy. It is a therapeutic intervention designed to enhance voluntary control of attention and interrupt the Cognitive-Attentional Syndrome (CAS).

---

## 🧠 What is ATT?

### Purpose

ATT trains flexible, executive control over attention to:
- Reduce self-focused attention
- Interrupt worry and rumination patterns
- Strengthen metacognitive awareness
- Counter the Cognitive-Attentional Syndrome

### The Three Phases

1. **Selective Attention (5 minutes)**
   - Focus on ONE sound
   - Ignore all other sounds
   - Periodic redirections when attention wanders

2. **Rapid Attention Switching (5 minutes)**
   - Switch attention between sounds
   - Intervals: 10s → 5s → 3s
   - Unpredictable pattern to maintain cognitive load

3. **Divided Attention (2 minutes)**
   - Absorb ALL sounds simultaneously
   - Expand awareness to multiple stimuli
   - Most cognitively demanding phase

### Total Duration: 12 minutes

---

## ✨ Features

### Protocol Fidelity

✅ Exactly follows Wells' 3-phase structure
✅ Accurate timing intervals (5 + 5 + 2 minutes)
✅ 6-9 spatially distinct sound sources
✅ Mix of internal, near, and far distance sounds
✅ Unpredictable switching patterns to prevent habituation
✅ Pre- and post-session self-attention ratings (-3 to +3)
✅ Fixation point for visual anchoring
✅ No relaxation framing or distraction elements

### Technical Features

- **Spatial Audio**: Web Audio API with stereo panning and distance simulation
- **High Cognitive Load**: Randomized variations prevent predictability
- **Session Tracking**: localStorage for progress monitoring
- **Responsive Design**: Works on desktop and tablet
- **Minimalist UI**: No distractions during training
- **Type-Safe**: Full TypeScript implementation

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- Modern web browser with Web Audio API support

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd att-application

# Install dependencies
npm install

# Add audio files to /public/sounds/
# See /public/sounds/README.md for details

# Run development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Audio Files Required

Before running, add these 9 audio files to `/public/sounds/`:

- `breath.mp3` - Internal sound
- `heartbeat.mp3` - Internal sound
- `white-noise.mp3` - Internal sound
- `clock-tick.mp3` - Near sound
- `water-drip.mp3` - Near sound
- `fan-hum.mp3` - Near sound
- `bird-distant.mp3` - Far sound
- `traffic-distant.mp3` - Far sound
- `wind-distant.mp3` - Far sound

See detailed instructions in `/public/sounds/README.md`

---

## 📁 Project Structure

```
att-application/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Landing page
│   │   ├── rating/
│   │   │   ├── pre/page.tsx   # Pre-session rating
│   │   │   └── post/page.tsx  # Post-session rating
│   │   ├── session/page.tsx   # ATT session screen
│   │   └── results/page.tsx   # Results and summary
│   │
│   ├── components/             # React components
│   │   ├── RatingScale.tsx    # 7-point bipolar scale
│   │   ├── FixationPoint.tsx  # Central fixation dot
│   │   ├── InstructionDisplay.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── WarningScreen.tsx  # Pre-session warning
│   │
│   ├── audio/                  # Audio engine
│   │   ├── AudioEngine.ts     # Web Audio API wrapper
│   │   └── soundSources.ts    # Sound source definitions
│   │
│   ├── session/                # Session management
│   │   ├── SessionManager.ts  # Orchestrates 3 phases
│   │   └── attProtocol.ts     # Protocol configuration
│   │
│   ├── utils/                  # Utilities
│   │   ├── storage.ts         # localStorage management
│   │   └── formatters.ts      # Display formatting
│   │
│   └── types/                  # TypeScript definitions
│       └── index.ts
│
├── public/
│   └── sounds/                 # Audio files (you add these)
│       └── README.md          # Audio setup guide
│
├── DEPLOYMENT.md              # Deployment guide
├── PROTOCOL_FIDELITY.md       # Scientific accuracy documentation
└── README.md                  # This file
```

---

## 🔬 Scientific Fidelity

This implementation strictly follows the ATT protocol as described in Wells (2009):

### ✅ Core Requirements Met

1. **Entirely auditory and spatial** - No visual attention tasks
2. **Fixed visual focus** - Eyes on fixation point throughout
3. **Exact phase structure** - 5min selective, 5min switching, 2min divided
4. **Switching intervals** - 10s → 5s → 3s as specified
5. **Cognitive load** - Unpredictable patterns, subtle variations
6. **Self-attention ratings** - Bipolar -3 to +3 scale
7. **No relaxation framing** - Explicit warning that ATT ≠ relaxation

See `PROTOCOL_FIDELITY.md` for detailed analysis.

---

## 🎮 User Flow

```
1. Landing Page
   ↓
2. Warning Screen (ATT is NOT relaxation)
   ↓
3. Pre-Session Rating (-3 to +3)
   ↓
4. Session Initialization (audio check)
   ↓
5. ATT Session (12 minutes)
   - Phase 1: Selective Attention (5 min)
   - Phase 2: Rapid Switching (5 min)
   - Phase 3: Divided Attention (2 min)
   ↓
6. Post-Session Rating (-3 to +3)
   ↓
7. Results & Analysis
   - Pre/post comparison
   - Session statistics
   - Progress tracking
```

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript 5.3
- **Styling**: TailwindCSS 3.4
- **State Management**: Zustand
- **Audio**: Web Audio API
- **Storage**: localStorage
- **Build Tool**: Turbopack (Next.js)

---

## 📊 Session Data

The application tracks:

- Pre-session self-attention rating
- Post-session self-attention rating
- Session duration
- Completion status
- Timestamp data

Data is stored locally in the browser (localStorage). No data is transmitted to servers.

---

## 🌐 Deployment

### Quick Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Options

- **Netlify**: Connect Git repository
- **Self-Hosted**: Node.js server with PM2
- **Docker**: Use provided Dockerfile
- **Static Export**: GitHub Pages, S3, etc.

See `DEPLOYMENT.md` for detailed instructions.

---

## 🎧 Audio Setup

### Quick Setup

1. Download sounds from Freesound.org or similar
2. Process with Audacity (normalize, loop, trim)
3. Place in `/public/sounds/` with exact names
4. Test in browser

### Detailed Instructions

See `/public/sounds/README.md` for:
- Sourcing audio files
- Processing guidelines
- Format specifications
- Testing procedures
- Mock file generation for testing

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SESSION_DURATION=720000  # 12 minutes
```

### Customization

To modify protocol parameters, edit:
- `/src/session/attProtocol.ts` - Timing and instructions
- `/src/audio/soundSources.ts` - Sound definitions
- `/src/types/index.ts` - Type definitions

---

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Run production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

### Code Quality

- Full TypeScript coverage
- ESLint configured
- Prettier formatting
- Component modularity
- Comprehensive comments

---

## 🐛 Troubleshooting

### Audio Not Playing

1. Check browser audio permissions
2. Ensure audio files are in `/public/sounds/`
3. Verify HTTPS (required by some browsers)
4. Test in different browser
5. Check console for errors

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### localStorage Issues

- Disable private/incognito mode
- Check browser privacy settings
- Clear browser cache

See `DEPLOYMENT.md` for more troubleshooting.

---

## 📚 References

### Primary Source

Wells, A. (2009). *Metacognitive Therapy for Anxiety and Depression*. Guilford Press.
- Chapter 4: The Attention Training Technique
- Appendix: Attention Training Technique Summary Sheet

### Related Research

- Wells, A., & Matthews, G. (1994). *Attention and Emotion: A Clinical Perspective*. Lawrence Erlbaum.
- Wells, A. (2000). *Emotional Disorders and Metacognition*. Wiley.
- Wells, A., & Matthews, G. (1996). Modelling cognition in emotional disorder: The S-REF model. *Behaviour Research and Therapy*, 34, 881-888.

---

## ⚠️ Important Disclaimers

### This Application Is:

✅ For research and educational purposes
✅ Based on published scientific protocol
✅ A training tool for attentional control

### This Application Is NOT:

❌ A substitute for professional mental health care
❌ A diagnostic tool
❌ A standalone treatment for clinical disorders
❌ Relaxation or meditation training

**If you are experiencing significant emotional distress, please consult a qualified mental health professional.**

---

## 📄 License

This project is provided for educational and research purposes.

The Attention Training Technique protocol is described in published scientific literature and is used here for educational implementation.

**Citation**: Wells, A. (2009). *Metacognitive Therapy for Anxiety and Depression*. Guilford Press.

---

## 🤝 Contributing

This is an educational project implementing a published scientific protocol. Contributions should maintain strict fidelity to the original ATT protocol.

To contribute:
1. Review Wells (2009) Chapter 4
2. Ensure changes align with protocol
3. Maintain TypeScript type safety
4. Add tests where appropriate
5. Update documentation

---

## 📧 Contact

For questions about the implementation or the ATT protocol, please refer to:
- Wells, A. (2009). *Metacognitive Therapy for Anxiety and Depression*
- Original research publications on metacognitive therapy

---

## 🙏 Acknowledgments

- **Adrian Wells** - Creator of the Attention Training Technique and Metacognitive Therapy
- **Guilford Press** - Publisher of source material
- **Next.js Team** - Framework
- **Vercel** - Hosting and deployment platform

---

## 📈 Version History

### v1.0.0 (Current)
- Complete implementation of ATT protocol
- Three-phase structure (selective, switching, divided)
- Spatial audio engine with Web Audio API
- Pre/post session ratings
- Session tracking and statistics
- Full TypeScript implementation
- Comprehensive documentation

---

**Built with scientific rigor for educational purposes.**

*Not a substitute for professional mental health care.*
