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
export { parseChapters, parseVTT } from './utils/vttParser';
import './index.css'; 
