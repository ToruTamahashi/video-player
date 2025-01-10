import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ThumbnailPreview } from './ThumbnailPreview';
import { ChapterMarker } from './ChapterMarker';
import { ChapterType } from '../types';
import { formatTimePair } from '../../../utils/time';

interface ProgressBarPropsType {
	currentTime: number;
	duration: number;
	chapters?: ChapterType[];
	onSeek: (time: number) => void;
	className?: string;
	videoRef: React.RefObject<HTMLVideoElement>;
}

const POPUP_PADDING = 8; // Padding for the popup

const ProgressBar: React.FC<ProgressBarPropsType> = ({
	currentTime,
	duration,
	chapters = [],
	onSeek,
	className = '',
	videoRef,
}) => {
	const progressRef = useRef<HTMLDivElement>(null);
	const previewRef = useRef<HTMLDivElement>(null);
	const [previewInfo, setPreviewInfo] = useState<{ position: number; time: number } | null>(null);
	const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});
	const [isHovering, setIsHovering] = useState(false);
	const lastUpdateRef = useRef<number>(0);

	// Calculate the position of the preview (including adjustments for screen edges)
	const calculatePreviewPosition = useCallback((rawPosition: number) => {
		if (!progressRef.current || !previewRef.current) return;

		const progressRect = progressRef.current.getBoundingClientRect();
		const previewRect = previewRef.current.getBoundingClientRect();
		const totalWidth = progressRect.width;
		const previewWidth = previewRect.width;

		// Absolute position from the left edge (in pixels)
		const positionPx = rawPosition * totalWidth;

		let left;
		// Adjustment for the left edge
		if (positionPx < previewWidth / 2 + POPUP_PADDING) {
			left = `${POPUP_PADDING}px`;
		}
		// Adjustment for the right edge
		else if (positionPx > totalWidth - previewWidth / 2 - POPUP_PADDING) {
			left = `calc(100% - ${previewWidth + POPUP_PADDING}px)`;
		}
		// Default centered position
		else {
			left = `calc(${rawPosition * 100}% - ${previewWidth / 2}px)`;
		}

		setPreviewStyle({ left });
	}, []);

	// Calculate position on preview mount
	useEffect(() => {
		if (previewInfo) {
			// Introduce a slight delay to wait for DOM updates
			const timer = setTimeout(() => {
				calculatePreviewPosition(previewInfo.position);
			}, 0);
			return () => clearTimeout(timer);
		}
	}, [previewInfo, calculatePreviewPosition]);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!progressRef.current) return;

			const now = Date.now();
			if (now - lastUpdateRef.current < 50) return;
			lastUpdateRef.current = now;

			const rect = progressRef.current.getBoundingClientRect();
			const position = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
			const time = position * duration;

			setPreviewInfo({ position, time });
		},
		[duration]
	);

	const handleMouseEnter = useCallback(() => {
		setIsHovering(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsHovering(false);
		setPreviewInfo(null);
		setPreviewStyle({});
	}, []);

	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			if (!progressRef.current) return;

			const rect = progressRef.current.getBoundingClientRect();
			const position = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
			onSeek(position * duration);
		},
		[duration, onSeek]
	);

	const progressPercent = (currentTime / duration) * 100;
	const [previewTimeFormatted] = previewInfo ? formatTimePair(previewInfo.time, duration) : ['0:00'];

	return (
		<div className="relative group">
			{/* Preview popup */}
			{isHovering && previewInfo && (
				<div ref={previewRef} className="absolute bottom-4 bg-black rounded p-1 z-20" style={previewStyle}>
					<ThumbnailPreview videoRef={videoRef} time={previewInfo.time} className="rounded mb-1" />
					<div className="text-white text-xs text-center tabular-nums font-mono w-16">{previewTimeFormatted}</div>
				</div>
			)}

			{/* Progress bar */}
			<div
				ref={progressRef}
				className={`relative w-full h-1 cursor-pointer ${className}`}
				onClick={handleClick}
				onMouseMove={handleMouseMove}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{/* Base (gray) */}
				<div className="absolute top-0 left-0 w-full h-full bg-gray-600" />

				{/* Played portion (red) */}
				<div
					className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-100"
					style={{ width: `${progressPercent}%` }}
				/>

				{/* Hover effect (only for unplayed portion) */}
				{isHovering && previewInfo && (
					<div
						className="absolute top-0 h-full bg-white/30 transition-all duration-100"
						style={{
							left: `${progressPercent}%`,
							width: `${Math.max(previewInfo.position * 100 - progressPercent, 0)}%`,
						}}
					/>
				)}

				{/* Chapter markers (displayed on top layer) */}
				<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
					<div className="relative w-full h-full">
						{chapters.map((chapter) => (
							<ChapterMarker key={chapter.startTime} chapter={chapter} duration={duration} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProgressBar;