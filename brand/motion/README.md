# Locked In Dept. motion library

Transparent loops for Final Cut Pro. Every file is ProRes 4444 with alpha, 30fps, so it drops on top of any footage or a black background.

## Files (in `out/`)

| File | What it is | Length | Use |
|---|---|---|---|
| `LID_sting_*` | The Pull for 1.2s, wordmark cuts in and holds | 3s | Intro. Cut on the wordmark frame. |
| `LID_pull_*` | Perspective rings drawn to a yellow centre | 6s loop | Under titles, chapter wipes, transitions |
| `LID_rings_*` | Flat concentric rings pulled inward | 4s loop | Icon moments, loaders, stories |
| `LID_field_*` | Dot grid bent by a moving gravity well | 8s loop | Under lower thirds, quiet backgrounds |
| `LID_band_*` | Particle head, yellow band across the eyes, dissolves right and returns | 7s loop | Title card, verdict frame in the score videos |
| `LID_merge_*` | Two discs close, overlap lights, FREEDOM, release | 6s loop | End card before the CTA |
| `LID_count_*` | Ring and number count 0 to 100, hold | 3s | Result reveals. Retime to land on the real score. |
| `LID_chrome_*` | Reflective metal blob, studio mirrored | 8s loop | Once per video. The art piece, the title. |

Landscape is 1920x1080, portrait is 1080x1920 (reels and stories).

## In Final Cut

1. Import the `out/` folder.
2. Drop a clip above your footage. Alpha is already there, no keying.
3. Loops: option-drag to duplicate end to end. First and last frames match.
4. Count: set a speed ramp so 100 lands where your number does, or cut on the frame that shows the score.
5. Chrome and yellow never share a frame. Pick one.

## Rules carried from the brand world

Everything is pulled, counted or dissolved. No bounce, no slide. Lines are 1px paper on ink. Yellow is one point or one band per frame. Chrome is touched once per video.

## Re-render

```
cd brand/motion && npm i && (cd ../.. && python3 -m http.server 8765 &) && node render.js both 30
```

Edit the motif functions in `render.html`. Each one is a pure function of time, so a change renders deterministically.
