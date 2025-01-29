import './index.css';
export { VideoPlayer } from './components/VideoPlayer';
export { Controls } from './components/Controls';
export { Subtitles } from './components/Subtitles';
export { ControlsWrapper } from './components/wrappers/ControlsWrapper';
export { ProgressBar } from './components/ProgressBar';
export { useVideoPlayer } from './hooks/useVideoPlayer';
export type {
	VideoPlayerRefType,
	VideoPlayerPropsType,
	SubtitleType,
	ChapterType,
	VideoPlayerStateType,
	VideoPlayerControlsType,
	VideoPlayerCallbacks,
} from './types';
export { parseVTT } from './utils/vttParser';
