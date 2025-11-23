# Audio Assets for ATT Application

This directory should contain the audio files used in the Attention Training Technique protocol.

## Required Audio Files

The application requires 9 spatially distinct sound sources. Each sound should be:

- **Format**: MP3, WAV, or OGG
- **Quality**: 44.1kHz sample rate, 16-bit minimum
- **Length**: 30-60 seconds (loopable)
- **Volume**: Normalized to consistent levels
- **Characteristics**: Distinct, non-overlapping frequency ranges

### Internal Sounds (3 files)

1. **breath.mp3**
   - Gentle breathing sound
   - Slow, rhythmic pattern
   - Low to medium frequency
   - Volume: Moderate

2. **heartbeat.mp3**
   - Simulated heartbeat
   - Regular rhythm (60-80 BPM)
   - Low frequency (bass)
   - Volume: Moderate

3. **white-noise.mp3**
   - Gentle white noise or pink noise
   - Continuous, non-rhythmic
   - Full spectrum
   - Volume: Low to moderate

### Near Sounds (3 files)

4. **clock-tick.mp3**
   - Clock ticking sound
   - Regular rhythm (1 Hz)
   - Mid-high frequency
   - Volume: Moderate to high

5. **water-drip.mp3**
   - Water dripping
   - Irregular pattern (every 2-3 seconds)
   - Mid frequency
   - Volume: Moderate

6. **fan-hum.mp3**
   - Fan or motor humming
   - Continuous, slight variation
   - Low to mid frequency
   - Volume: Low to moderate

### Far Sounds (3 files)

7. **bird-distant.mp3**
   - Birds chirping in distance
   - Irregular, natural pattern
   - Mid to high frequency
   - Volume: Low

8. **traffic-distant.mp3**
   - Distant traffic or urban ambience
   - Continuous with variation
   - Low to mid frequency
   - Volume: Very low

9. **wind-distant.mp3**
   - Wind blowing in distance
   - Continuous, varying
   - Low to mid frequency with variation
   - Volume: Very low

## Sourcing Audio Files

### Option 1: Professional Audio Libraries (Recommended)

- **Freesound.org**: https://freesound.org/
  - Free, Creative Commons licensed sounds
  - High quality field recordings
  - Search for each sound type and download

- **BBC Sound Effects**: https://sound-effects.bbcrewind.co.uk/
  - Free for personal, educational, research & non-commercial use
  - Professional quality recordings

- **Zapsplat**: https://www.zapsplat.com/
  - Free sound effects library
  - Requires attribution

### Option 2: Generate Synthetic Sounds

Use tools like:
- **Audacity** (free): https://www.audacityteam.org/
- **GarageBand** (macOS)
- **Tone.js** for web-based generation

### Option 3: Record Your Own

Use a quality microphone to record:
- Your own breathing
- A real clock ticking
- Water dripping
- Natural outdoor sounds

## Processing Audio Files

### Using Audacity (Free)

1. **Import** your audio file
2. **Normalize**: Effect → Normalize → OK
3. **Trim** to 30-60 seconds
4. **Ensure seamless loop**:
   - Effect → Fade In (first 0.5s)
   - Effect → Fade Out (last 0.5s)
5. **Export**: File → Export → MP3
   - Quality: 192kbps or higher

### Audio Specifications

```
Format: MP3
Bitrate: 192-320 kbps
Sample Rate: 44100 Hz
Channels: Stereo (preferred) or Mono
Length: 30-60 seconds
Volume: Normalized to -3dB
```

## Quick Setup with Mock Files

For testing purposes, you can use simple tone generators or create silent placeholder files:

### Generate Test Tones (Python)

```python
import numpy as np
from scipy.io import wavfile

def generate_tone(filename, frequency, duration=30, sample_rate=44100):
    t = np.linspace(0, duration, int(sample_rate * duration))
    audio = np.sin(2 * np.pi * frequency * t)
    audio = (audio * 32767).astype(np.int16)
    wavfile.write(filename, sample_rate, audio)

# Generate different frequencies for each sound
generate_tone('breath.wav', 100)    # Low frequency
generate_tone('heartbeat.wav', 80)  # Very low
generate_tone('white-noise.wav', 440) # Mid
generate_tone('clock-tick.wav', 800) # High
generate_tone('water-drip.wav', 600) # Mid-high
generate_tone('fan-hum.wav', 120)   # Low
generate_tone('bird-distant.wav', 1000) # High
generate_tone('traffic-distant.wav', 150) # Low
generate_tone('wind-distant.wav', 200) # Low-mid
```

### Generate Test Tones (JavaScript/Node.js)

```javascript
// Using the 'audio-generator' npm package
npm install audio-generator

const generate = require('audio-generator/stream');
const Speaker = require('speaker');
const fs = require('fs');

// Example for generating a tone
generate(function(time) {
  return Math.sin(Math.PI * 2 * time * 440); // 440 Hz tone
}).pipe(fs.createWriteStream('sound.wav'));
```

## Verification

After adding your audio files, verify:

1. ✅ All 9 files are present in `/public/sounds/`
2. ✅ Files are named exactly as specified (case-sensitive)
3. ✅ Files play correctly in a media player
4. ✅ Volumes are balanced across all files
5. ✅ No clipping or distortion
6. ✅ Files loop seamlessly

## Attribution

If using Creative Commons or licensed audio, include attribution in:
`/public/sounds/ATTRIBUTION.txt`

Example format:
```
Sound: Clock Ticking
Author: John Doe
Source: Freesound.org
License: CC BY 4.0
URL: https://freesound.org/people/johndoe/sounds/12345/

[Repeat for each sound]
```

## File Structure

```
/public/sounds/
  ├── README.md (this file)
  ├── ATTRIBUTION.txt (if using licensed audio)
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

## Important Notes for ATT Protocol

1. **Spatial Distinctness**: Each sound should occupy a different "audio space"
   - Varying frequencies prevent masking
   - Distinct timbres aid identification

2. **Non-Distracting**: Sounds should be neutral, not emotionally evocative
   - Avoid music, speech, or alarming sounds
   - Natural, repetitive patterns work best

3. **Cognitive Load**: Sounds should be challenging but possible to distinguish
   - Too similar = frustrating
   - Too different = too easy

4. **Volume Balance**: All sounds should be audible but none should dominate
   - Internal sounds: moderate volume
   - Near sounds: moderate to high volume
   - Far sounds: low volume, subtle

## Troubleshooting

**Audio doesn't play:**
- Check browser console for errors
- Verify file paths match exactly
- Ensure files are in `/public/sounds/` directory
- Try different audio formats (MP3, OGG, WAV)

**Sounds overlap/muddy:**
- Normalize volumes in audio editor
- Ensure distinct frequency ranges
- Check for clipping in waveforms

**Looping gaps/clicks:**
- Add fade in/out to loop points
- Ensure sample-accurate loop points
- Use audio editor to create seamless loops

## Resources

- **Freesound.org**: Free sound effects
- **Audacity**: Free audio editor
- **ffmpeg**: Command-line audio processing
- **Online Tone Generator**: https://www.szynalski.com/tone-generator/
