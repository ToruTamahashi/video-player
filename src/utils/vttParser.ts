import { WebVTTType } from '../components/VideoPlayer/types';

export const parseVTT = (vttContent: string): WebVTTType[] => {
	const lines = vttContent.trim().split('\n');
	const vttContents: WebVTTType[] = [];
	let currentVtt: Partial<WebVTTType> = {};
	let currentIndex = 0;

	let i = 1;
	while (i < lines.length) {
		const line = lines[i].trim();

		if (line.includes('-->')) {
			const [startTime, endTime] = line.split('-->').map((timeStr) => {
				const [hh, mm, ss] = timeStr.trim().split(':');
				const [seconds, milliseconds] = ss.split('.');
				return (
					parseInt(hh) * 3600 +
					parseInt(mm) * 60 +
					parseInt(seconds) +
					(milliseconds ? parseInt(milliseconds) / 1000 : 0)
				);
			});

			currentVtt = {
				index: currentIndex,
				startTime,
				endTime,
			};
			currentIndex++;
		} else if (line && currentVtt.startTime !== undefined) {
			currentVtt.text = line;
			vttContents.push(currentVtt as WebVTTType);
			currentVtt = {};
		}

		i++;
	}

	return vttContents;
};
