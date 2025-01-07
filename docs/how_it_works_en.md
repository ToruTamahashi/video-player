# React Video Player Implementation Guide

## Main Component (VideoPlayer)

### Core Design

The VideoPlayer implements a combination of the Render Props pattern and `forwardRef`:

```tsx
export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>((props, ref) => {
	// ...implementation
});
```

### Component State Management

1. **Internal State Management**

```typescript
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [volume, setVolume] = useState(1);
```

2. **External Control via Ref**

```typescript
useImperativeHandle(ref, () => ({
	play: () => videoRef.current?.play(),
	pause: () => videoRef.current?.pause(),
	getCurrentTime: () => videoRef.current?.currentTime || 0,
	getDuration: () => videoRef.current?.duration || 0,
	seek: (time: number) => {
		if (videoRef.current) {
			videoRef.current.currentTime = time;
		}
	},
}));
```

### Event Handling

```typescript
const handleTimeUpdate = () => {
	if (videoRef.current) {
		setCurrentTime(videoRef.current.currentTime);
		onTimeUpdate?.(videoRef.current.currentTime);
	}
};

const handleLoadedMetadata = () => {
	if (videoRef.current) {
		setDuration(videoRef.current.duration);
		setVolume(videoRef.current.volume);
	}
};

const handlePlay = () => {
	setIsPlaying(true);
	onPlay?.();
};

const handlePause = () => {
	setIsPlaying(false);
	onPause?.();
};
```

### Render Props Implementation

Providing necessary information and control functions to child components:

```typescript
{
	children?.({
		videoRef,
		state: {
			isPlaying,
			currentTime,
			duration,
			volume,
		},
		controls: {
			play: () => videoRef.current?.play(),
			pause: () => videoRef.current?.pause(),
			seek: (time) => {
				if (videoRef.current) {
					videoRef.current.currentTime = time;
				}
			},
			setVolume: handleVolumeChange,
		},
	});
}
```

Usage example:

```tsx
{({ videoRef, state, controls }) => (
  // state: playback state, time, volume, etc.
  // controls: play, pause, seek functions, etc.
)}
```

## Component Structure

### Controls Component

Provides UI elements for progress bar, play/pause button, and volume controls.

### Progress Bar

Integrates progress display, chapter markers, and thumbnail preview functionality:

```
ProgressBar/
├── index.ts
├── ProgressBar.tsx         # Main component
├── ChapterMarker.tsx      # Chapter marker
└── ThumbnailPreview.tsx   # Thumbnail preview
```

### Thumbnail Preview

Handles preview display during hover and cache management.

## Extensibility and Flexibility

### 1. External Control

```typescript
// Example of external control
const playerRef = useRef<VideoPlayerRef>(null);
playerRef.current?.seek(30); // Jump to 30 seconds
```

### 2. Customizable UI

```tsx
<VideoPlayer ref={playerRef} src="video.mp4">
	{({ state, controls }) => (
		<>
			<CustomSubtitles />
			<CustomControls isPlaying={state.isPlaying} onPlay={controls.play} onPause={controls.pause} />
		</>
	)}
</VideoPlayer>
```

### 3. Event Handling

```tsx
<VideoPlayer
	onTimeUpdate={(time) => console.log('Current time:', time)}
	onPlay={() => console.log('Video started')}
	onPause={() => console.log('Video paused')}
/>
```

## Performance Considerations

1. **Memory Management**

   - Proper cleanup of video elements
   - Event listener cleanup

2. **Render Optimization**

   - Optimized state updates
   - Minimal rendering

3. **Resource Management**
   - Efficient preview generation
   - Cache utilization

## Error Handling

```typescript
// Video operation error handling
const handlePlay = async () => {
	try {
		await videoRef.current?.play();
		setIsPlaying(true);
		onPlay?.();
	} catch (error) {
		console.error('Failed to play video:', error);
	}
};
```

## Maintainability

1. **Type Utilization**

```typescript
interface VideoPlayerProps {
	src?: string;
	className?: string;
	onTimeUpdate?: (currentTime: number) => void;
	onPlay?: () => void;
	onPause?: () => void;
	children?: (props: VideoPlayerRenderProps) => React.ReactNode;
}

interface VideoPlayerRef {
	play: () => void;
	pause: () => void;
	getCurrentTime: () => number;
	getDuration: () => number;
	seek: (time: number) => void;
}
```

2. **Code Organization**

   - Proper separation of concerns
   - Component independence

3. **Reusability**
   - Generic interfaces
   - Flexible customization options

This implementation provides a video player with the following characteristics:

- Flexible customization
- Robust error handling
- High performance
- Excellent maintainability

## Core Features Implementation

### 1. Progress Bar and Thumbnail Preview

The progress bar consists of multiple layers, each serving a distinct purpose:

```tsx
<div className="relative">
	{/* Base layer (gray) */}
	<div className="absolute w-full h-full bg-gray-600" />

	{/* Played portion (red) */}
	<div className="absolute h-full bg-red-600" style={{ width: `${progress}%` }} />

	{/* Hover effect for unplayed portion */}
	{isHovering && previewInfo && (
		<div
			className="absolute h-full bg-white/30"
			style={{
				left: `${progressPercent}%`,
				width: `${Math.max(previewInfo.position * 100 - progressPercent, 0)}%`,
			}}
		/>
	)}
</div>
```

Thumbnail preview position adjustment is implemented with the following logic:

```typescript
const calculatePreviewPosition = useCallback((rawPosition: number) => {
	if (!progressRef.current || !previewRef.current) return;

	const progressRect = progressRef.current.getBoundingClientRect();
	const previewRect = previewRef.current.getBoundingClientRect();
	const totalWidth = progressRect.width;
	const previewWidth = previewRect.width;

	// Calculate absolute position
	let positionPx = rawPosition * totalWidth;

	// Edge position adjustments
	if (positionPx < previewWidth / 2 + PADDING) {
		return `${PADDING}px`; // Left edge
	}
	if (positionPx > totalWidth - previewWidth / 2 - PADDING) {
		return `calc(100% - ${previewWidth + PADDING}px)`; // Right edge
	}

	// Center position
	return `calc(${rawPosition * 100}% - ${previewWidth / 2}px)`;
}, []);
```

### 2. Thumbnail Generation and Caching

The thumbnail cache system is implemented using a custom hook:

```typescript
const useThumbnailCache = (videoRef: React.RefObject<HTMLVideoElement>) => {
	const cacheRef = useRef<Record<number, string>>({});
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [videoClone, setVideoClone] = useState<HTMLVideoElement | null>(null);

	// Setup video clone and canvas
	useEffect(() => {
		const canvas = document.createElement('canvas');
		canvas.width = 160;
		canvas.height = 90;
		canvasRef.current = canvas;

		const clonedVideo = document.createElement('video');
		clonedVideo.src = videoRef.current?.src || '';
		document.body.appendChild(clonedVideo);
		setVideoClone(clonedVideo);

		return () => {
			clonedVideo.remove();
			cacheRef.current = {};
		};
	}, [videoRef.current?.src]);

	// Thumbnail generation with caching
	const getThumbnail = useCallback(
		async (time: number) => {
			const roundedTime = Math.floor(time);
			if (cacheRef.current[roundedTime]) {
				return cacheRef.current[roundedTime];
			}

			if (!videoClone || !canvasRef.current) return null;

			return new Promise<string | null>((resolve) => {
				const handleSeeked = () => {
					const context = canvasRef.current?.getContext('2d');
					if (!context) return resolve(null);

					context.drawImage(videoClone, 0, 0, 160, 90);
					const thumbnail = canvasRef.current?.toDataURL('image/jpeg', 0.5);

					if (thumbnail) {
						cacheRef.current[roundedTime] = thumbnail;
						resolve(thumbnail);
					}

					videoClone.removeEventListener('seeked', handleSeeked);
				};

				videoClone.addEventListener('seeked', handleSeeked);
				videoClone.currentTime = time;
			});
		},
		[videoClone]
	);

	return getThumbnail;
};
```

### 3. Chapter Markers

Chapter markers are positioned on the progress bar with hover information:

```tsx
const ChapterMarker: React.FC<{ chapter: Chapter; duration: number }> = ({ chapter, duration }) => {
	const position = (chapter.startTime / duration) * 100;
	const [formattedTime] = formatTimePair(chapter.startTime, duration);

	return (
		<div
			className="absolute top-0 w-0.5 h-full bg-white/80 transform -translate-x-1/2 
                 hover:bg-yellow-400 transition-colors pointer-events-auto cursor-pointer"
			style={{ left: `${position}%` }}
			title={`${chapter.title} (${formattedTime})`}
		/>
	);
};
```

### 4. Performance Optimizations

1. **Event Throttling**

```typescript
const handleMouseMove = useCallback(
	(e: React.MouseEvent) => {
		const now = Date.now();
		if (now - lastUpdateRef.current < 50) return; // Skip updates within 50ms
		lastUpdateRef.current = now;

		// Position calculation and preview update
	},
	[duration]
);
```

2. **Thumbnail Caching**

- Thumbnails are generated only once per second
- Cached in memory for quick retrieval
- Automatic cleanup on component unmount

3. **Render Optimization**

- Conditional rendering for preview and hover effects
- Memoized callback functions
- Efficient position calculations

4. **Resource Management**

- Video clone for thumbnail generation
- Canvas reuse
- Event listener cleanup

```typescript
useEffect(() => {
	// Setup
	return () => {
		// Cleanup resources
		videoClone?.remove();
		cacheRef.current = {};
	};
}, []);
```

These implementations provide:

- Smooth user interaction
- Efficient resource usage
- Responsive preview updates
- Clean edge-case handling
