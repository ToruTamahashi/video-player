import React, { useMemo } from 'react';
import { SubtitleType } from '../types';

interface SubtitlesPropsType {
	subtitles?: SubtitleType[];
	currentTime: number;
	className?: string;
}

export const Subtitles: React.FC<SubtitlesPropsType> = ({ subtitles = [], currentTime, className = '' }) => {
	const currentSubtitle = useMemo(() => {
		return subtitles.find((subtitle) => currentTime >= subtitle.startTime && currentTime <= subtitle.endTime);
	}, [subtitles, currentTime]);

	if (!currentSubtitle) {
		return null;
	}

	return (
		<div className={`tvp-absolute tvp-left-0 tvp-right-0 tvp-bottom-16 tvp-text-center ${className}`}>
			<div className="tvp-inline-block tvp-bg-black/70 tvp-px-4 tvp-py-2 tvp-rounded-lg tvp-text-white">
				{currentSubtitle.text}
			</div>
		</div>
	);
};
