// src/components/VideoPlayer/types.ts
import { ComponentType, ReactNode } from 'react';

export interface Subtitle {
	startTime: number;
	endTime: number;
	text: string;
}

export interface Chapter {
	id: number;
	startTime: number;
	endTime: number;
	title: string;
}

export interface VideoPlayerState {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
}

export interface VideoPlayerControls {
	play: () => void;
	pause: () => void;
	seek: (time: number) => void;
	setVolume: (volume: number) => void;
}

export interface VideoPlayerRenderProps {
	videoRef: React.RefObject<HTMLVideoElement>;
	state: VideoPlayerState;
	controls: VideoPlayerControls;
}

export interface VideoPlayerProps {
	src?: string;
	className?: string;
	onTimeUpdate?: (currentTime: number) => void;
	onPlay?: () => void;
	onPause?: () => void;
	children?: (props: VideoPlayerRenderProps) => ReactNode;
}

export interface VideoPlayerRef {
	play: () => void;
	pause: () => void;
	getCurrentTime: () => number;
	getDuration: () => number;
	seek: (time: number) => void;
}

export interface ControlsProps {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	chapters?: Chapter[];
	videoRef: React.RefObject<HTMLVideoElement>;
	onPlay: () => void;
	onPause: () => void;
	onSeek: (time: number) => void;
	onVolumeChange: (volume: number) => void;
	className?: string;
	progressBarClassName?: string;
	children?: React.ReactNode;
	customIcons?: CustomIcons;
}

export interface CustomIcons {
	Play?: ComponentType<{ className?: string }>;
	Pause?: ComponentType<{ className?: string }>;
	VolumeHigh?: ComponentType<{ className?: string }>;
	VolumeMedium?: ComponentType<{ className?: string }>;
	VolumeLow?: ComponentType<{ className?: string }>;
	VolumeMute?: ComponentType<{ className?: string }>;
}
