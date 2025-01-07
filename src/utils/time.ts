export const formatTime = (timeInSeconds: number): string => {
	if (!Number.isFinite(timeInSeconds)) return '0:00';

	const hours = Math.floor(timeInSeconds / 3600);
	const minutes = Math.floor((timeInSeconds % 3600) / 60);
	const seconds = Math.floor(timeInSeconds % 60);

	// 動画が1時間以上の場合は hh:mm:ss 形式
	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}
	// 1時間未満の場合は mm:ss 形式
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// 2つの時間を同じフォーマットで表示するためのユーティリティ
export const formatTimePair = (currentTime: number, totalTime: number): [string, string] => {
	const hasHours = totalTime >= 3600;

	if (hasHours) {
		// 両方とも hh:mm:ss 形式で返す
		const formatWithHours = (time: number) => {
			const h = Math.floor(time / 3600);
			const m = Math.floor((time % 3600) / 60);
			const s = Math.floor(time % 60);
			return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
		};
		return [formatWithHours(currentTime), formatWithHours(totalTime)];
	} else {
		// 両方とも mm:ss 形式で返す
		const formatMinutesSeconds = (time: number) => {
			const m = Math.floor(time / 60);
			const s = Math.floor(time % 60);
			return `${m}:${s.toString().padStart(2, '0')}`;
		};
		return [formatMinutesSeconds(currentTime), formatMinutesSeconds(totalTime)];
	}
};
