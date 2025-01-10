import './index.css';
export { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
export { Controls } from './components/VideoPlayer/Controls';
export { Subtitles } from './components/VideoPlayer/Subtitles';
export type {
	VideoPlayerRefType,
	VideoPlayerPropsType,
	SubtitleType,
	ChapterType,
	VideoPlayerStateType,
	VideoPlayerControlsType,
} from './components/VideoPlayer/types';
export { parseVTT } from './utils/vttParser';
