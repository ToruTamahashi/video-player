# @torutamahashi/video-player

A highly customizable React video player component with chapter markers, subtitles, and thumbnail preview functionality.

## Features

- 📝 Chapter and subtitle support with WebVTT format
- 🖼 Thumbnail preview on seek bar hover
- 🎨 Fully customizable styling with TailwindCSS
- 🎯 Chapter markers on progress bar
- 🔊 Advanced volume control
- 🎨 Customizable icons
- 📱 Responsive design
- 🔧 TypeScript support

## Installation

```bash
npm install @torutamahashi/video-player
# or
yarn add @torutamahashi/video-player
# or
pnpm add @torutamahashi/video-player
```

### Configuration(Optional)

1. Add styling to your application:

```typescript
import '@torutamahashi/video-player/dist/style.css';
```

2. Configure TailwindCSS (if you want to customize styles):

```javascript
// tailwind.config.js
module.exports = {
  content: [
    // ... your other content paths
    './node_modules/@torutamahashi/video-player/dist/**/*.{js,ts,jsx,tsx}'
  ],
};
```

Note: TailwindCSS is an optional peer dependency. You can use the default styles without it.

## Basic Usage

```tsx
import { VideoPlayer, Controls, Subtitles } from '@torutamahashi/video-player';

function App() {
  return (
    <VideoPlayer src="path/to/video.mp4">
      {({ videoRef, state, controls }) => (
        <>
          <Subtitles
            subtitles={subtitles}
            currentTime={state.currentTime}
          />
          <Controls
            videoRef={videoRef}
            isPlaying={state.isPlaying}
            currentTime={state.currentTime}
            duration={state.duration}
            volume={state.volume}
            onPlay={controls.play}
            onPause={controls.pause}
            onSeek={controls.seek}
            onVolumeChange={controls.setVolume}
          />
        </>
      )}
    </VideoPlayer>
  );
}
```

## Using Chapters and Subtitles

The player supports WebVTT format for both chapters and subtitles.

### WebVTT Format Example

```vtt
WEBVTT

00:00:00.000 --> 00:02:30.000
1.0 Introduction

00:02:30.000 --> 00:05:00.000
2.0 Main Content
```

### Parsing WebVTT Files

Built-in parsers are available for both chapters and subtitles:

```typescript
import { parseVTT, parseChapters } from '@torutamahashi/video-player';

// Parse subtitles
const subtitles = parseVTT(vttContent);

// Parse chapters
const chapters = parseChapters(vttContent);
```

### Using Chapters in Component

```tsx
<VideoPlayer src="video.mp4">
  {({ videoRef, state, controls }) => (
    <Controls
      videoRef={videoRef}
      {...state}
      {...controls}
      chapters={chapters}
    />
  )}
</VideoPlayer>
```

## Customization

### Icons

You can provide your own icons (default icons are included):

```tsx
const customIcons = {
  Play: ({ className }) => <YourPlayIcon className={className} />,
  Pause: ({ className }) => <YourPauseIcon className={className} />,
  VolumeHigh: ({ className }) => <YourVolumeHighIcon className={className} />,
  VolumeMedium: ({ className }) => <YourVolumeMediumIcon className={className} />,
  VolumeLow: ({ className }) => <YourVolumeLowIcon className={className} />,
  VolumeX: ({ className }) => <YourVolumeXIcon className={className} />
};

<Controls {...props} customIcons={customIcons} />
```

### Styles

Customize using TailwindCSS utility classes:

```tsx
<VideoPlayer className="rounded-lg overflow-hidden">
  {({ videoRef, state, controls }) => (
    <>
      <Subtitles
        className="mb-4 text-lg font-bold"
        // ...
      />
      <Controls
        className="bg-black/70 p-3"
        progressBarClassName="h-2"
        // ...
      />
    </>
  )}
</VideoPlayer>
```

## API Reference

### VideoPlayer Props

| Prop | Type | Description |
|------|------|-------------|
| src | string | Video source URL |
| className | string | Container class name |
| children | (props: VideoPlayerRenderProps) => React.ReactNode | Render props function |
| onTimeUpdate? | (currentTime: number) => void | Time update callback |
| onPlay? | () => void | Play event callback |
| onPause? | () => void | Pause event callback |

### Controls Props

| Prop | Type | Description |
|------|------|-------------|
| isPlaying | boolean | Playback state |
| currentTime | number | Current playback time |
| duration | number | Video duration |
| volume | number | Volume level (0-1) |
| chapters? | Chapter[] | Chapter information |
| className? | string | Controller class name |
| customIcons? | CustomIcons | Custom icon configuration |
| progressBarClassName? | string | Progress bar class name |

### Subtitles Props

| Prop | Type | Description |
|------|------|-------------|
| subtitles | Subtitle[] | Subtitle data |
| currentTime | number | Current playback time |
| className? | string | Subtitle class name |

## TypeScript Support

The library includes comprehensive type definitions:

```typescript
import type { 
  VideoPlayerRef, 
  VideoPlayerProps,
  Chapter, 
  Subtitle 
} from '@torutamahashi/video-player';

const chapters: Chapter[] = [
  {
    id: 1,
    startTime: 0,
    endTime: 150,
    title: "Introduction"
  }
];
```


## Contributing

Issues and Pull Requests are welcome! Please feel free to contribute to this project.

## License

MIT © [Toru Tamahashi](https://github.com/torutamahashi)