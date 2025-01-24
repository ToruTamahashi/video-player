import React, { useRef, useState } from 'react';

import { Play, Pause, Volume2, Volume1, Volume, VolumeX } from 'lucide-react';
import { ChapterType, SubtitleType, VideoPlayerRefType } from '../../components/VideoPlayer/types';
import { parseVTT } from '../../utils/vttParser';
import { VideoPlayer } from '../../components/VideoPlayer/VideoPlayer';
import { Subtitles } from '../../components/VideoPlayer/Subtitles';
import { Controls } from '../../components/VideoPlayer/Controls';
import { ControlsWrapper } from '../../components/VideoPlayer/wrappers/ControlsWrapper';
import ProgressBar from '../../components/VideoPlayer/ProgressBar';

export const App: React.FC = () => {
	const [videoSrc, setVideoSrc] = useState<string>();
	const [chapters, setChapters] = useState<ChapterType[]>([]);
	const [subtitles, setSubtitles] = useState<SubtitleType[]>([]);
	const playerRef = useRef<VideoPlayerRefType>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setVideoSrc(url);
		}
	};

	const handleChapterFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			try {
				const text = await file.text();
				const parsedChapters = parseVTT(text);
				setChapters(parsedChapters);
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
				setSubtitles(parsedSubtitles);
			} catch (error) {
				console.error('Failed to parse subtitle file:', error);
				alert('Failed to parse subtitle file. Please ensure it is a valid WebVTT file.');
			}
		}
	};

	const handleChapterClick = (startTime: number) => {
		playerRef.current?.seek(startTime);
	};

	const customIcons = {
		Play: ({ className }: { className?: string }) => <Play className={className} />,
		Pause: ({ className }: { className?: string }) => <Pause className={className} />,
		VolumeHigh: ({ className }: { className?: string }) => <Volume2 className={className} />,
		VolumeMedium: ({ className }: { className?: string }) => <Volume1 className={className} />,
		VolumeLow: ({ className }: { className?: string }) => <Volume className={className} />,
		VolumeMute: ({ className }: { className?: string }) => <VolumeX className={className} />,
	};

	return (
		<div className="max-w-4xl mx-auto p-4">
			<div className="space-y-4 mb-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
					<input
						type="file"
						accept="video/*"
						onChange={handleFileChange}
						className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
					/>
				</div>

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
					{videoSrc && (
						<VideoPlayer ref={playerRef} src={videoSrc} className="rounded-lg overflow-hidden ">
							{({ videoRef, state, controls }) => (
								<>
									<Subtitles subtitles={subtitles} currentTime={state.currentTime} className="mb-4 text-lg" />
									<ControlsWrapper className='bg-red-400'>
										<ProgressBar
											currentTime={state.currentTime}
											duration={state.duration}
											chapters={chapters}
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
											customIcons={customIcons}
										>
											{/* <div className="flex justify-between">
												<button
													className=" text-white text-sm px-3 py-1 rounded bg-violet-600 hover:bg-violet-700"
													onClick={() => controls.seek(0)}
												>
													Restart
												</button>
												<Settings className="text-white" />
											</div> */}
										</Controls>
									</ControlsWrapper>
								</>
							)}
						</VideoPlayer>
					)}
				</div>

				{chapters.length > 0 && (
					<div className="md:col-span-1">
						<div className="bg-white rounded-lg shadow overflow-hidden">
							<div className="bg-violet-50 px-4 py-2 border-b border-violet-100">
								<h2 className="text-violet-900 font-medium">Chapters</h2>
							</div>
							<div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
								{chapters.map((chapter) => (
									<button
										key={chapter.startTime}
										onClick={() => handleChapterClick(chapter.startTime)}
										className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
									>
										<div className="font-medium text-gray-900">{chapter.text}</div>
										<div className="text-sm text-gray-500 tabular-nums">
											{new Date(chapter.startTime * 1000).toISOString().substr(11, 8)}
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
