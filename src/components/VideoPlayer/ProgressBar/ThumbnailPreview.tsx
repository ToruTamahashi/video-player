import React, { useRef, useState, useCallback, useEffect } from 'react';

// Custom hook to manage the thumbnail cache
const useThumbnailCache = (videoRef: React.RefObject<HTMLVideoElement>) => {
	const cacheRef = useRef<Record<number, string>>({});
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [videoClone, setVideoClone] = useState<HTMLVideoElement | null>(null);

	useEffect(() => {
		if (!videoRef.current) return;

		const canvas = document.createElement('canvas');
		canvas.width = 160;
		canvas.height = 90;
		canvasRef.current = canvas;

		const clonedVideo = document.createElement('video');
		clonedVideo.src = videoRef.current.src;
		clonedVideo.preload = 'metadata';
		clonedVideo.style.display = 'none';
		clonedVideo.crossOrigin = 'anonymous';
		document.body.appendChild(clonedVideo);
		setVideoClone(clonedVideo);

		return () => {
			clonedVideo.remove();
			cacheRef.current = {};
		};
	}, [videoRef.current?.src]);

	const getThumbnail = useCallback(
		async (time: number) => {
			const roundedTime = Math.floor(time);
			if (cacheRef.current[roundedTime]) {
				return cacheRef.current[roundedTime];
			}

			if (!videoClone || !canvasRef.current) return null;

			return new Promise<string | null>((resolve) => {
				const handleSeeked = () => {
					const context = canvasRef.current?.getContext('2d');
					if (!context) return resolve(null);

					context.drawImage(videoClone, 0, 0, 160, 90);
					const thumbnail = canvasRef.current?.toDataURL('image/jpeg', 0.5);

					if (thumbnail) {
						cacheRef.current[roundedTime] = thumbnail;
						resolve(thumbnail);
					} else {
						resolve(null);
					}

					videoClone.removeEventListener('seeked', handleSeeked);
				};

				videoClone.addEventListener('seeked', handleSeeked);
				videoClone.currentTime = time;
			});
		},
		[videoClone]
	);

	return getThumbnail;
};

interface ThumbnailPreviewPropsType {
	videoRef: React.RefObject<HTMLVideoElement>;
	time: number;
	className?: string;
}

export const ThumbnailPreview: React.FC<ThumbnailPreviewPropsType> = ({ videoRef, time, className = '' }) => {
	const [thumbnail, setThumbnail] = useState<string | null>(null);
	const getThumbnail = useThumbnailCache(videoRef);

	useEffect(() => {
		let isMounted = true;

		const loadThumbnail = async () => {
			const newThumbnail = await getThumbnail(time);
			if (isMounted && newThumbnail) {
				setThumbnail(newThumbnail);
			}
		};

		loadThumbnail();

		return () => {
			isMounted = false;
		};
	}, [time, getThumbnail]);

	if (!thumbnail) {
		return <div className={`w-40 h-[90px] bg-gray-800 ${className}`} />;
	}

	return <img src={thumbnail} alt={`Preview at ${time}s`} className={`w-40 h-[90px] object-cover ${className}`} />;
};
