// hooks/useVideoPlayer.ts
import { useRef, useState, useCallback } from 'react';
import { ChapterType, SubtitleType, VideoPlayerCallbacks, VideoPlayerRefType } from '../types';

export const useVideoPlayer = (callbacks?: VideoPlayerCallbacks) => {
	const playerRef = useRef<VideoPlayerRefType>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(1);

	const [chapters, setChapters] = useState<ChapterType[]>([]);
	const [subtitles, setSubtitles] = useState<SubtitleType[]>([]);

	// Internal handlers
	const handleLoadedMetadata = useCallback(
		(duration: number) => {
			setDuration(duration);
			callbacks?.onLoadedMetadata?.(duration);
		},
		[callbacks]
	);

	const handleTimeUpdate = useCallback(
		(time: number) => {
			setCurrentTime(time);
			callbacks?.onTimeUpdate?.(time);
		},
		[callbacks]
	);

	const handlePlay = useCallback(() => {
		setIsPlaying(true);
		callbacks?.onPlay?.();
	}, [callbacks]);

	const handlePause = useCallback(() => {
		setIsPlaying(false);
		callbacks?.onPause?.();
	}, [callbacks]);

	// Public API
	const play = useCallback(() => {
		playerRef.current?.play();
	}, []);

	const pause = useCallback(() => {
		playerRef.current?.pause();
	}, []);

	const seek = useCallback((time: number) => {
		playerRef.current?.seek(time);
	}, []);

	const setVideoVolume = useCallback((newVolume: number) => {
		if (playerRef.current) {
			playerRef.current.setVolume(newVolume);
			setVolume(newVolume);
		}
	}, []);

	const videoPlayerProps = {
		ref: playerRef,
		videoRef,
		onTimeUpdate: handleTimeUpdate,
		onPlay: handlePlay,
		onPause: handlePause,
		onLoadedMetadata: handleLoadedMetadata,
	};

	return {
		state: {
			currentTime,
			duration,
			isPlaying,
			volume,
			subtitles,
			chapters,
		},
		controls: {
			play,
			pause,
			seek,
			setVolume: setVideoVolume,
			setSubtitles,
			setChapters
		},
		videoRef,
		videoPlayerProps,
	} as const;
};
