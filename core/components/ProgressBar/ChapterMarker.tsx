import React from 'react';
import { ChapterType } from '../../types';
import { formatTimePair } from '../../utils/time';

interface ChapterMarkerPropsType {
	chapter: ChapterType;
	duration: number;
}

export const ChapterMarker: React.FC<ChapterMarkerPropsType> = ({ chapter, duration }) => {
	const position = (chapter.startTime / duration) * 100;
	const [formattedTime] = formatTimePair(chapter.startTime, duration);

	return (
		<div
			className="tvp-absolute tvp-top-0 tvp-w-0.5 tvp-h-full tvp-bg-white/50 tvp-transform tvp--translate-x-1/2 hover:tvp-bg-yellow-400 tvp-transition-colors tvp-pointer-events-auto tvp-cursor-pointer"
			style={{ left: `${position}%` }}
			title={`${chapter.text} (${formattedTime})`}
		/>
	);
};
