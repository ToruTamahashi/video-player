import React, { useCallback } from 'react';
import {
	PlayIcon as DefaultPlayIcon,
	PauseIcon as DefaultPauseIcon,
	VolumeHighIcon as DefaultVolumeHighIcon,
	VolumeMediumIcon as DefaultVolumeMediumIcon,
	VolumeLowIcon as DefaultVolumeLowIcon,
	VolumeXIcon as DefaultVolumeXIcon,
} from '../icons/DefaultIcons';
import { formatTimePair } from '../utils/time';
import { ControlsPropsType } from '../types';

export const Controls: React.FC<ControlsPropsType> = ({
	isPlaying,
	currentTime,
	duration,
	volume,
	onPlay,
	onPause,
	onVolumeChange,
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
		<div className="tvp-grid tvp-grid-cols-[auto_auto_auto_1fr] tvp-items-center tvp-gap-4 tvp-mt-2">
			<button className="tvp-text-white hover:tvp-text-gray-300" onClick={isPlaying ? onPause : onPlay}>
				{isPlaying ? <PauseIcon className="tvp-w-6 tvp-h-6" /> : <PlayIcon className="tvp-w-6 tvp-h-6" />}
			</button>

			<div className="tvp-text-white tvp-text-sm tvp-tabular-nums tvp-font-mono tvp-min-w-[80px] tvp-text-center">
				{formatTimePair(currentTime, duration).join(' / ')}
			</div>

			<div className="tvp-flex tvp-items-center tvp-space-x-2">
				<button className="tvp-text-white hover:tvp-text-gray-300" onClick={handleVolumeIconClick}>
					<VolumeIcon className="tvp-w-6 tvp-h-6" />
				</button>
				<div className="tvp-relative tvp-w-20 tvp-h-1">
					<div className="tvp-absolute tvp-top-0 tvp-left-0 tvp-w-full tvp-h-full tvp-bg-gray-600 tvp-rounded-full" />
					<div
						className="tvp-absolute tvp-top-0 tvp-left-0 tvp-h-full tvp-bg-blue-500 tvp-rounded-full"
						style={{ width: `${volume * 100}%` }}
					/>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={volume}
						onChange={(e) => onVolumeChange(Number(e.target.value))}
						className="tvp-absolute tvp-top-0 tvp-left-0 tvp-w-full tvp-h-full tvp-opacity-0 tvp-cursor-pointer
                [&::-webkit-slider-thumb]:tvp-appearance-none [&::-webkit-slider-thumb]:tvp-w-3 
                [&::-webkit-slider-thumb]:tvp-h-3 [&::-webkit-slider-thumb]:tvp-bg-white 
                [&::-webkit-slider-thumb]:tvp-rounded-full [&::-webkit-slider-thumb]:tvp-opacity-100
                hover:[&::-webkit-slider-thumb]:tvp-bg-violet-200"
					/>
				</div>
			</div>
			<div>{children}</div>
		</div>
	);
};
