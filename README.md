# React Custom Video Player

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
npm install react-custom-video-player
# or
yarn add react-custom-video-player
```

## Basic Usage

```tsx
import { VideoPlayer, Controls, Subtitles } from 'react-custom-video-player';

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

## Using Chapters

The player supports WebVTT format chapter files:

```vtt
WEBVTT

00:00:00.000 --> 00:02:30.000
1.0 Introduction

00:02:30.000 --> 00:05:00.000
2.0 Main Content
```

Example with chapters:

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

## Using Subtitles

The player supports WebVTT format subtitle files:

```vtt
WEBVTT

00:00:01.000 --> 00:00:04.000
Hello, world.

00:00:04.000 --> 00:00:06.000
Welcome!
```

## Customizing Icons

You can replace the default icons with your own:

```tsx
// Example using lucide-react
import { Play, Pause, Volume2, Volume1, Volume, VolumeX } from 'lucide-react';

const customIcons = {
  Play: ({ className }) => <Play className={className} />,
  Pause: ({ className }) => <Pause className={className} />,
  VolumeHigh: ({ className }) => <Volume2 className={className} />,
  VolumeMedium: ({ className }) => <Volume1 className={className} />,
  VolumeLow: ({ className }) => <Volume className={className} />,
  VolumeX: ({ className }) => <VolumeX className={className} />
};

<Controls
  {...props}
  customIcons={customIcons}
/>
```

## Customizing Styles

You can customize the styles using TailwindCSS:

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

## Component Props

### VideoPlayer

| Prop | Type | Description |
|------|------|-------------|
| src | string | Video source URL |
| className | string | Container class name |
| children | function | Render props function |

### Controls

| Prop | Type | Description |
|------|------|-------------|
| isPlaying | boolean | Playback state |
| currentTime | number | Current playback time |
| duration | number | Video duration |
| volume | number | Volume level (0-1) |
| chapters | Chapter[] | Chapter information |
| className | string | Controller class name |
| customIcons | CustomIcons | Custom icon configuration |

### Subtitles

| Prop | Type | Description |
|------|------|-------------|
| subtitles | Subtitle[] | Subtitle data |
| currentTime | number | Current playback time |
| className | string | Subtitle class name |

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/react-custom-video-player.git

# Install dependencies
cd react-custom-video-player
npm install

# Start development server
npm run dev

# Build
npm run build
```

## Key Features Explained

### Thumbnail Preview
- Shows video thumbnail when hovering over the progress bar
- Caches thumbnails for better performance
- Updates in real-time as you move the cursor

### Chapter Markers
- Visual markers on the progress bar
- Click to jump to specific chapters
- Tooltip showing chapter title and timestamp

### Volume Control
- Click icon to toggle mute
- Drag slider to adjust volume
- Icons change based on volume level
- Remembers previous volume when unmuting

### Progress Bar
- Shows playback progress
- Click to seek
- Hover effect for unplayed portions
- Integrated with chapter markers

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## TypeScript Support

The library is written in TypeScript and includes full type definitions. Example type usage:

```typescript
import { VideoPlayerRef, Chapter, Subtitle } from 'react-custom-video-player';

const chapters: Chapter[] = [
  {
    id: 1,
    startTime: 0,
    endTime: 150,
    title: "Introduction"
  }
];

const subtitles: Subtitle[] = [
  {
    startTime: 0,
    endTime: 5,
    text: "Hello, world!"
  }
];
```

## License

MIT

## Contributing

Issues and Pull Requests are always welcome! Please feel free to contribute to this project.