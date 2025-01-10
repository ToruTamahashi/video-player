// src/components/VideoPlayer/types.ts
import { ComponentType, ReactNode } from 'react';

export interface WebVTTType {
	index: number;
	startTime: number;
	endTime: number;
	text: string;
}
export type SubtitleType = WebVTTType;

export type ChapterType = WebVTTType;

export interface VideoPlayerStateType {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
}

export interface VideoPlayerControlsType {
	play: () => void;
	pause: () => void;
	seek: (time: number) => void;
	setVolume: (volume: number) => void;
}

export interface VideoPlayerRenderPropsType {
	videoRef: React.RefObject<HTMLVideoElement>;
	state: VideoPlayerStateType;
	controls: VideoPlayerControlsType;
}

export interface VideoPlayerPropsType {
	src?: string;
	className?: string;
	onTimeUpdate?: (currentTime: number) => void;
	onPlay?: () => void;
	onPause?: () => void;
	children?: (props: VideoPlayerRenderPropsType) => ReactNode;
}

export interface VideoPlayerRefType {
	play: () => void;
	pause: () => void;
	getCurrentTime: () => number;
	getDuration: () => number;
	seek: (time: number) => void;
}

export interface ControlsPropsType {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	chapters?: ChapterType[];
	videoRef: React.RefObject<HTMLVideoElement>;
	onPlay: () => void;
	onPause: () => void;
	onSeek: (time: number) => void;
	onVolumeChange: (volume: number) => void;
	className?: string;
	progressBarClassName?: string;
	children?: React.ReactNode;
	customIcons?: CustomIconsType;
}

export interface CustomIconsType {
	Play?: ComponentType<{ className?: string }>;
	Pause?: ComponentType<{ className?: string }>;
	VolumeHigh?: ComponentType<{ className?: string }>;
	VolumeMedium?: ComponentType<{ className?: string }>;
	VolumeLow?: ComponentType<{ className?: string }>;
	VolumeMute?: ComponentType<{ className?: string }>;
}
