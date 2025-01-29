import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ThumbnailPreview } from './ThumbnailPreview';
import { ChapterMarker } from './ChapterMarker';
import { ChapterType } from '../../types';
import { formatTimePair } from '../../utils/time';

type HeightOption = 'sm' | 'md' | 'lg';

interface ProgressBarPropsType {
	currentTime: number;
	duration: number;
	chapters?: ChapterType[];
	onSeek: (time: number) => void;
	className?: string;
	videoRef: React.RefObject<HTMLVideoElement>;
	height?: HeightOption;
	baseColor?: string;
	progressColor?: string;
	thumbnailPreviewClassName?: string;
}

const POPUP_PADDING = 8; // Padding for the popup

const heightMap: Record<HeightOption, string> = {
	sm: 'tvp-h-1',
	md: 'tvp-h-2',
	lg: 'tvp-h-3',
};

const ProgressBar: React.FC<ProgressBarPropsType> = ({
	currentTime,
	duration,
	chapters = [],
	onSeek,
	className = '',
	videoRef,
	height = 'sm',
	baseColor = '#4B5563',
	progressColor = '#DC2626',
	thumbnailPreviewClassName = '',
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
		<div className="tvp-relative tvp-group">
			{/* Preview popup */}
			{isHovering && previewInfo && (
				<div
					ref={previewRef}
					className="tvp-absolute tvp-bottom-4 tvp-bg-black tvp-rounded tvp-p-1 tvp-z-20"
					style={previewStyle}
				>
					<ThumbnailPreview
						videoRef={videoRef}
						time={previewInfo.time}
						className={`tvp-rounded tvp-mb-1 ${thumbnailPreviewClassName}`}
					/>
					<div className="tvp-text-white tvp-text-xs tvp-text-center tvp-tabular-nums tvp-font-mono tvp-w-16">
						{previewTimeFormatted}
					</div>
				</div>
			)}

			{/* Progress bar */}
			<div
				ref={progressRef}
				className={`tvp-relative tvp-w-full tvp-cursor-pointer ${heightMap[height]} ${className}`}
				onClick={handleClick}
				onMouseMove={handleMouseMove}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{/* Base (gray) */}
				<div
					className={`tvp-absolute tvp-top-0 tvp-left-0 tvp-w-full tvp-h-full`}
					style={{ backgroundColor: baseColor }}
				/>

				{/* Played portion (red) */}
				<div
					className={`tvp-absolute tvp-top-0 tvp-left-0 tvp-h-full tvp-transition-all tvp-duration-100`}
					style={{ backgroundColor: progressColor, width: `${progressPercent}%` }}
				/>

				{/* Hover effect (only for unplayed portion) */}
				{isHovering && previewInfo && (
					<div
						className="tvp-absolute tvp-top-0 tvp-h-full tvp-bg-white/30 tvp-transition-all tvp-duration-100"
						style={{
							left: `${progressPercent}%`,
							width: `${Math.max(previewInfo.position * 100 - progressPercent, 0)}%`,
						}}
					/>
				)}

				{/* Chapter markers */}
				<div className="tvp-absolute tvp-top-0 tvp-left-0 tvp-w-full tvp-h-full tvp-pointer-events-none">
					<div className="tvp-relative tvp-w-full tvp-h-full">
						{chapters.map((chapter) => (
							<ChapterMarker key={chapter.startTime} chapter={chapter} duration={duration} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export { ProgressBar };
