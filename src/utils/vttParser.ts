import { Chapter, Subtitle } from '../components/VideoPlayer/types';

export const parseVTT = (vttContent: string): Subtitle[] => {
	const lines = vttContent.trim().split('\n');
	const subtitles: Subtitle[] = [];
	let currentSubtitle: Partial<Subtitle> = {};

	// VTTヘッダーをスキップ
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

			currentSubtitle = {
				startTime,
				endTime,
			};
		} else if (line && currentSubtitle.startTime !== undefined) {
			currentSubtitle.text = line;
			subtitles.push(currentSubtitle as Subtitle);
			currentSubtitle = {};
		}

		i++;
	}

	return subtitles;
};

export const parseChapters = (vttContent: string): Chapter[] => {
	const lines = vttContent.trim().split('\n');
	const chapters: Chapter[] = [];
	let currentChapter: Partial<Chapter> = {};
	let currentId = 1;

	// VTTヘッダーをスキップ
	let i = 1;
	while (i < lines.length) {
		const line = lines[i].trim();

		if (line.includes('-->')) {
			const [startStr, endStr] = line.split('-->').map((str) => str.trim());

			const parseTime = (timeStr: string): number => {
				const [hh, mm, ss] = timeStr.split(':');
				const [seconds, milliseconds = '000'] = ss.split('.');
				return parseInt(hh) * 3600 + parseInt(mm) * 60 + parseInt(seconds) + parseInt(milliseconds) / 1000;
			};

			currentChapter = {
				id: currentId,
				startTime: parseTime(startStr),
				endTime: parseTime(endStr),
			};
		} else if (line && currentChapter.startTime !== undefined) {
			// チャプタータイトルからID部分を削除（例: "1.0 Title" → "Title"）
			const titleMatch = line.match(/^\d+\.?\d*\s+(.+)$/);
			currentChapter.title = titleMatch ? titleMatch[1] : line;

			chapters.push(currentChapter as Chapter);
			currentChapter = {};
			currentId++;
		}

		i++;
	}

	return chapters;
};
