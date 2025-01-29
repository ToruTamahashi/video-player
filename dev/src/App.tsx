import { Controls, ControlsWrapper, parseVTT, Subtitles, VideoPlayer, ProgressBar, useVideoPlayer } from '../../core';
import React from 'react';

export const App: React.FC = () => {
	const { videoRef, state, controls, videoPlayerProps } = useVideoPlayer({
		onTimeUpdate: (time) => {
			console.log('Current time:', time);
		},
		onLoadedMetadata: (duration) => {
			console.log('Video is loaded, total duration is:', duration);
		},
	});

	const handleChapterFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			try {
				const text = await file.text();
				const parsedChapters = parseVTT(text);
				controls.setChapters(parsedChapters);
			} catch (error) {
				console.error('Failed to parse chapter file:', error);
				alert('Failed to parse chapter file. Please ensure it is a valid WebVTT file.');
			}
		}
	};

	const handleSubtitleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			try {
				const text = await file.text();
				const parsedSubtitles = parseVTT(text);
				controls.setSubtitles(parsedSubtitles);
			} catch (error) {
				console.error('Failed to parse subtitle file:', error);
				alert('Failed to parse subtitle file. Please ensure it is a valid WebVTT file.');
			}
		}
	};

	const handleDownloadSubtitle = async () => {
		try {
			const response = await fetch('/trailer_subtitles.vtt');
			if (!response.ok) throw new Error('Failed to fetch subtitles.vtt');

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = 'sample_subtitles.vtt';
			document.body.appendChild(a);
			a.click();

			// Clean up
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Download failed:', error);
			alert('Failed to download subtitles.vtt');
		}
	};

	const handleDownloadChapter = async () => {
		try {
			const response = await fetch('/trailer_chapters.vtt');
			if (!response.ok) throw new Error('Failed to fetch chapters.vtt');

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = 'sample_chapters.vtt';
			document.body.appendChild(a);
			a.click();

			// Clean up
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Download failed:', error);
			alert('Failed to download chapters.vtt');
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-4">
			<div className="space-y-4 mb-4">
				<button
					onClick={handleDownloadSubtitle}
					className="w-full py-2 px-4 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200"
				>
					Download Sample Subtitle VTT
				</button>
				<button
					onClick={handleDownloadChapter}
					className="w-full py-2 px-4 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200"
				>
					Download Sample Chapter VTT
				</button>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Subtitle File (WebVTT)</label>
					<input
						type="file"
						accept=".vtt"
						onChange={handleSubtitleFileChange}
						className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Chapters File (WebVTT)</label>
					<input
						type="file"
						accept=".vtt"
						onChange={handleChapterFileChange}
						className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="md:col-span-3">
					<VideoPlayer
						{...videoPlayerProps}
						src={
							'https://raw.githubusercontent.com/mdn/learning-area/main/javascript/apis/video-audio/finished/video/sintel-short.mp4'
						}
						className="rounded-lg overflow-hidden"
					>
						<Subtitles subtitles={state.subtitles} currentTime={state.currentTime} className="mb-4 text-lg" />
						<ControlsWrapper className="bg-black/70">
							<ProgressBar
								currentTime={state.currentTime}
								duration={state.duration}
								chapters={state.chapters}
								onSeek={controls.seek}
								height="sm"
								progressColor="#DC2626"
								videoRef={videoRef}
							/>
							<Controls
								isPlaying={state.isPlaying}
								currentTime={state.currentTime}
								duration={state.duration}
								volume={state.volume}
								onPlay={controls.play}
								onPause={controls.pause}
								onVolumeChange={controls.setVolume}
								className="bg-black/70 p-3"
							>
								<div className="flex justify-between">
									<button
										className=" text-white text-sm px-3 py-1 rounded bg-violet-600 hover:bg-violet-700"
										onClick={() => controls.seek(0)}
									>
										Custom UI
									</button>
								</div>
							</Controls>
						</ControlsWrapper>
					</VideoPlayer>
					<div>current time(s): {state.currentTime}</div>
					<div>total duration(s): {state.duration}</div>
				</div>

				{state.chapters.length > 0 && (
					<div className="md:col-span-1">
						<div className="bg-white rounded-lg shadow overflow-hidden">
							<div className="bg-violet-50 px-4 py-2 border-b border-violet-100">
								<h2 className="text-violet-900 font-medium">Chapters</h2>
							</div>
							<div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
								{state.chapters.map((chapter) => (
									<button
										key={chapter.startTime}
										onClick={() => controls.seek(chapter.startTime)}
										className={`w-full px-4 py-2 text-left focus:outline-none ${
											chapter.index === state.currentChapter?.index
												? 'bg-gray-700 text-white hover:bg-gray-600 focus:bg-gray-600'
												: 'hover:bg-gray-50 focus:bg-gray-50'
										}`}
									>
										<div
											className={`font-medium ${
												chapter.index === state.currentChapter?.index ? 'text-white' : 'text-gray-900'
											}`}
										>
											{chapter.text}
										</div>
										<div
											className={`text-sm tabular-nums ${
												chapter.index === state.currentChapter?.index ? 'text-zinc-300' : 'text-zinc-500'
											}`}
										>
											<span>{new Date(chapter.startTime * 1000).toISOString().substr(11, 8)}</span>
											<span className="mx-1">-</span>
											<span>{new Date(chapter.endTime * 1000).toISOString().substr(11, 8)}</span>
										</div>
									</button>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
