// src/components/VideoPlayer/Controls.tsx
import React, { useCallback } from 'react';
import {
	PlayIcon as DefaultPlayIcon,
	PauseIcon as DefaultPauseIcon,
	VolumeHighIcon as DefaultVolumeHighIcon,
	VolumeMediumIcon as DefaultVolumeMediumIcon,
	VolumeLowIcon as DefaultVolumeLowIcon,
	VolumeXIcon as DefaultVolumeXIcon,
} from './icons/DefaultIcons';
import ProgressBar from './ProgressBar';
import { formatTimePair } from '../../utils/time';
import { ControlsPropsType } from './types';

export const Controls: React.FC<ControlsPropsType> = ({
	isPlaying,
	currentTime,
	duration,
	volume,
	chapters = [],
	videoRef,
	onPlay,
	onPause,
	onSeek,
	onVolumeChange,
	className = '',
	progressBarClassName = '',
	children,
	customIcons = {},
}) => {
	const [previousVolume, setPreviousVolume] = React.useState(1);

	const handleVolumeIconClick = useCallback(() => {
		if (volume > 0) {
			setPreviousVolume(volume);
			onVolumeChange(0);
		} else {
			onVolumeChange(previousVolume);
		}
	}, [volume, previousVolume, onVolumeChange]);

	const getVolumeIcon = useCallback(() => {
		const { VolumeHigh, VolumeMedium, VolumeLow, VolumeMute } = customIcons;

		if (volume === 0) return VolumeMute || DefaultVolumeXIcon;
		if (volume < 0.3) return VolumeLow || DefaultVolumeLowIcon;
		if (volume < 0.7) return VolumeMedium || DefaultVolumeMediumIcon;
		return VolumeHigh || DefaultVolumeHighIcon;
	}, [volume, customIcons]);

	const PlayIcon = customIcons.Play || DefaultPlayIcon;
	const PauseIcon = customIcons.Pause || DefaultPauseIcon;
	const VolumeIcon = getVolumeIcon();

	return (
		<div className={`absolute bottom-0 left-0 right-0 bg-black/50 p-2 ${className}`}>
			<ProgressBar
				currentTime={currentTime}
				duration={duration}
				chapters={chapters}
				onSeek={onSeek}
				className={progressBarClassName}
				videoRef={videoRef}
			/>

			<div className="grid grid-cols-[auto_auto_auto_1fr] items-center gap-4 mt-2">
				<button className="text-white hover:text-gray-300" onClick={isPlaying ? onPause : onPlay}>
					{isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
				</button>

				<div className="text-white text-sm tabular-nums font-mono min-w-[80px] text-center">
					{formatTimePair(currentTime, duration).join(' / ')}
				</div>

				<div className="flex items-center space-x-2">
					<button className="text-white hover:text-gray-300" onClick={handleVolumeIconClick}>
						<VolumeIcon className="w-6 h-6" />
					</button>
					<div className="relative w-20 h-1">
						<div className="absolute top-0 left-0 w-full h-full bg-gray-600 rounded-full" />
						<div
							className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
							style={{ width: `${volume * 100}%` }}
						/>
						<input
							type="range"
							min="0"
							max="1"
							step="0.01"
							value={volume}
							onChange={(e) => onVolumeChange(Number(e.target.value))}
							className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:opacity-100
                hover:[&::-webkit-slider-thumb]:bg-violet-200"
						/>
					</div>
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
};
