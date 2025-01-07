import React, { useMemo } from 'react';
import { Subtitle } from './types';

interface SubtitlesProps {
	subtitles?: Subtitle[];
	currentTime: number;
	className?: string;
}

export const Subtitles: React.FC<SubtitlesProps> = ({ subtitles = [], currentTime, className = '' }) => {
	const currentSubtitle = useMemo(() => {
		return subtitles.find((subtitle) => currentTime >= subtitle.startTime && currentTime <= subtitle.endTime);
	}, [subtitles, currentTime]);

	if (!currentSubtitle) {
		return null;
	}

	return (
		<div className={`absolute left-0 right-0 bottom-16 text-center ${className}`}>
			<div className="inline-block bg-black/70 px-4 py-2 rounded-lg text-white">{currentSubtitle.text}</div>
		</div>
	);
};
