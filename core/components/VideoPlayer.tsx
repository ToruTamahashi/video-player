import { forwardRef, useImperativeHandle } from 'react';
import { VideoPlayerPropsType, VideoPlayerRefType } from '../types';

export const VideoPlayer = forwardRef<VideoPlayerRefType, VideoPlayerPropsType>(
	({ src, className = '', videoRef, onTimeUpdate, onLoadedMetadata, onPlay, onPause, children }, ref) => {
		// const videoRef = useRef<HTMLVideoElement>(null);

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
			setVolume: (newVolume: number) => {
				if (videoRef.current) {
					videoRef.current.volume = newVolume;
				}
			},
		}));

		const handleTimeUpdate = () => {
			if (videoRef.current) {
				onTimeUpdate?.(videoRef.current.currentTime);
			}
		};

		const handleLoadedMetadata = () => {
			if (videoRef.current) {
				handlePause();
				onLoadedMetadata?.(videoRef.current.duration);
			}
		};

		const handlePlay = () => {
			onPlay?.();
		};

		const handlePause = () => {
			onPause?.();
		};

		return (
			<div className={`tvp-relative tvp-w-full tvp-aspect-video tvp-bg-black ${className}`}>
				<video
					ref={videoRef}
					className="tvp-w-full tvp-h-full"
					onTimeUpdate={handleTimeUpdate}
					onLoadedMetadata={handleLoadedMetadata}
					onPlay={handlePlay}
					onPause={handlePause}
					src={src}
					crossOrigin="anonymous"
				/>
				{children}
			</div>
		);
	}
);

VideoPlayer.displayName = 'VideoPlayer';
