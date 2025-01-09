import './index.css';
export { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
export { Controls } from './components/VideoPlayer/Controls';
export { Subtitles } from './components/VideoPlayer/Subtitles';
export type {
	VideoPlayerRef,
	VideoPlayerProps,
	Subtitle,
	Chapter,
	VideoPlayerState,
	VideoPlayerControls,
} from './components/VideoPlayer/types';
export { parseVTT } from './utils/vttParser';
