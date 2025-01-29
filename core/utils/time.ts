export const formatTime = (timeInSeconds: number): string => {
	if (!Number.isFinite(timeInSeconds)) return '0:00';

	const hours = Math.floor(timeInSeconds / 3600);
	const minutes = Math.floor((timeInSeconds % 3600) / 60);
	const seconds = Math.floor(timeInSeconds % 60);

	// If the video is longer than 1 hour, use hh:mm:ss format
	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}
	// For less than 1 hour, use mm:ss format
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Utility to display two times in the same format
export const formatTimePair = (currentTime: number, totalTime: number): [string, string] => {
	const hasHours = totalTime >= 3600;

	if (hasHours) {
		// Return both times in hh:mm:ss format
		const formatWithHours = (time: number) => {
			const h = Math.floor(time / 3600);
			const m = Math.floor((time % 3600) / 60);
			const s = Math.floor(time % 60);
			return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
		};
		return [formatWithHours(currentTime), formatWithHours(totalTime)];
	} else {
		// Return both times in mm:ss format
		const formatMinutesSeconds = (time: number) => {
			const m = Math.floor(time / 60);
			const s = Math.floor(time % 60);
			return `${m}:${s.toString().padStart(2, '0')}`;
		};
		return [formatMinutesSeconds(currentTime), formatMinutesSeconds(totalTime)];
	}
};
