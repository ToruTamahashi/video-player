import React from 'react';
import { ChapterType } from '../types';
import { formatTimePair } from '../../../utils/time';

interface ChapterMarkerPropsType {
	chapter: ChapterType;
	duration: number;
}

export const ChapterMarker: React.FC<ChapterMarkerPropsType> = ({ chapter, duration }) => {
	const position = (chapter.startTime / duration) * 100;
	const [formattedTime] = formatTimePair(chapter.startTime, duration);

	return (
		<div
			className="absolute top-0 w-0.5 h-full bg-white/80 transform -translate-x-1/2 hover:bg-yellow-400 transition-colors pointer-events-auto cursor-pointer"
			style={{ left: `${position}%` }}
			title={`${chapter.text} (${formattedTime})`}
		/>
	);
};
