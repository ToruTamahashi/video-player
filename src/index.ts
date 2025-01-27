import './index.css';
export { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
export { Controls } from './components/VideoPlayer/Controls';
export { Subtitles } from './components/VideoPlayer/Subtitles';
export { ControlsWrapper } from './components/VideoPlayer/wrappers/ControlsWrapper';
export { ProgressBar } from './components/VideoPlayer/ProgressBar';
export { useVideoPlayer } from './components/VideoPlayer/hooks/useVideoPlayer';
export type {
	VideoPlayerRefType,
	VideoPlayerPropsType,
	SubtitleType,
	ChapterType,
	VideoPlayerStateType,
	VideoPlayerControlsType,
	VideoPlayerCallbacks,
} from './components/VideoPlayer/types';
export { parseVTT } from './utils/vttParser';
