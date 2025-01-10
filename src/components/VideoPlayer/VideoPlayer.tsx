import { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { VideoPlayerPropsType, VideoPlayerRefType } from './types';

export const VideoPlayer = forwardRef<VideoPlayerRefType, VideoPlayerPropsType>(
	({ src, className = '', onTimeUpdate, onPlay, onPause, children }, ref) => {
		const videoRef = useRef<HTMLVideoElement>(null);
		const [isPlaying, setIsPlaying] = useState(false);
		const [currentTime, setCurrentTime] = useState(0);
		const [duration, setDuration] = useState(0);
		const [volume, setVolume] = useState(1);

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
				handlePause();
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

		const handleVolumeChange = (newVolume: number) => {
			if (videoRef.current) {
				videoRef.current.volume = newVolume;
				setVolume(newVolume);
			}
		};

		return (
			<div className={`relative w-full aspect-video bg-black ${className}`}>
				<video
					ref={videoRef}
					className="w-full h-full"
					onTimeUpdate={handleTimeUpdate}
					onLoadedMetadata={handleLoadedMetadata}
					onPlay={handlePlay}
					onPause={handlePause}
					src={src}
				/>
				{children?.({
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
				})}
			</div>
		);
	}
);

VideoPlayer.displayName = 'VideoPlayer';
