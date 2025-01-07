# React Video Playerの実装解説

## メインコンポーネント (VideoPlayer)

### 基本設計

VideoPlayerはRender Propsパターンと`forwardRef`を組み合わせた設計を採用しています：

```tsx
export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>((props, ref) => {
  // ...実装
});
```

### コンポーネントの状態管理

1. **内部状態の管理**
```typescript
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
const [volume, setVolume] = useState(1);
```

2. **外部制御用のref実装**
```typescript
useImperativeHandle(ref, () => ({
  play: () => videoRef.current?.play(),
  pause: () => videoRef.current?.pause(),
  getCurrentTime: () => videoRef.current?.currentTime || 0,
  getDuration: () => videoRef.current?.duration || 0,
  seek: (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  },
}));
```

### イベントハンドリング

```typescript
const handleTimeUpdate = () => {
  if (videoRef.current) {
    setCurrentTime(videoRef.current.currentTime);
    onTimeUpdate?.(videoRef.current.currentTime);
  }
};

const handleLoadedMetadata = () => {
  if (videoRef.current) {
    setDuration(videoRef.current.duration);
    setVolume(videoRef.current.volume);
  }
};

const handlePlay = () => {
  setIsPlaying(true);
  onPlay?.();
};

const handlePause = () => {
  setIsPlaying(false);
  onPause?.();
};
```

### Render Propsパターンの実装

子コンポーネントに必要な情報と制御機能を提供：

```typescript
{children?.({
  videoRef,
  state: {
    isPlaying,
    currentTime,
    duration,
    volume,
  },
  controls: {
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    seek: (time) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    setVolume: handleVolumeChange,
  },
})}
```

呼び出し側
```tsx

  {({ videoRef, state, controls }) => (
    // state: 再生状態、時間、音量など
    // controls: 再生、一時停止、シーク機能など
  )}

```

## サブコンポーネント構成

### コントロールパネル（Controls）

プログレスバー、再生/一時停止ボタン、音量コントロールなどのUI要素を提供します。

### プログレスバー（ProgressBar）

進捗表示、チャプターマーカー、サムネイルプレビューの機能を統合します：

```
ProgressBar/
├── index.ts
├── ProgressBar.tsx          # メインコンポーネント
├── ChapterMarker.tsx       # チャプターマーカー
└── ThumbnailPreview.tsx    # サムネイルプレビュー
```

### サムネイルプレビュー

マウスホバー時のプレビュー表示とキャッシュ管理を担当します。

## 拡張性と柔軟性

### 1. 外部制御

```typescript
// 外部からの制御例
const playerRef = useRef<VideoPlayerRef>(null);
playerRef.current?.seek(30);  // 30秒位置にジャンプ
```

### 2. カスタマイズ可能なUI

```tsx
<VideoPlayer ref={playerRef} src="video.mp4">
  {({ state, controls }) => (
    <>
      <CustomSubtitles />
      <CustomControls
        isPlaying={state.isPlaying}
        onPlay={controls.play}
        onPause={controls.pause}
      />
    </>
  )}
</VideoPlayer>
```

### 3. イベントハンドリング

```tsx
<VideoPlayer
  onTimeUpdate={(time) => console.log('Current time:', time)}
  onPlay={() => console.log('Video started')}
  onPause={() => console.log('Video paused')}
/>
```

## パフォーマンスの考慮

1. **メモリ管理**
   - ビデオ要素の適切な解放
   - イベントリスナーのクリーンアップ

2. **レンダリングの最適化**
   - 状態更新の最適化
   - 必要最小限のレンダリング

3. **リソース管理**
   - プレビュー生成の効率化
   - キャッシュの活用

## エラーハンドリング

```typescript
// ビデオ操作時のエラーハンドリング
const handlePlay = async () => {
  try {
    await videoRef.current?.play();
    setIsPlaying(true);
    onPlay?.();
  } catch (error) {
    console.error('Failed to play video:', error);
  }
};
```

## メンテナンス性

1. **型の活用**
```typescript
interface VideoPlayerProps {
  src?: string;
  className?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  children?: (props: VideoPlayerRenderProps) => React.ReactNode;
}

interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  seek: (time: number) => void;
}
```

2. **コードの分割**
   - 適切な責務の分離
   - コンポーネントの独立性

3. **再利用性**
   - 汎用的なインターフェース
   - 柔軟なカスタマイズオプション

このような実装により、以下のような特徴を持つビデオプレーヤーが実現されています：

- 柔軟なカスタマイズ性
- 堅牢なエラーハンドリング
- 高いパフォーマンス
- 優れた保守性


# コア機能の実装詳細

## 1. プログレスバーとサムネイルプレビュー

プログレスバーは複数のレイヤーで構成され、それぞれが独立した役割を持ちます：

```tsx

  {/* ベース（グレー） */}
  
  
  {/* 再生済み部分（赤） */}
  
  
  {/* 未再生部分のホバーエフェクト */}
  {isHovering && previewInfo && (
    
  )}

```

サムネイルプレビューの位置調整は以下のロジックで実装しています：

```typescript
const calculatePreviewPosition = useCallback((rawPosition: number) => {
  if (!progressRef.current || !previewRef.current) return;

  const progressRect = progressRef.current.getBoundingClientRect();
  const previewRect = previewRef.current.getBoundingClientRect();
  const totalWidth = progressRect.width;
  const previewWidth = previewRect.width;
  
  // 左端からの絶対位置を計算
  let positionPx = rawPosition * totalWidth;

  // 画面端での位置調整
  if (positionPx < previewWidth / 2 + PADDING) {
    return `${PADDING}px`;  // 左端の場合
  }
  if (positionPx > totalWidth - previewWidth / 2 - PADDING) {
    return `calc(100% - ${previewWidth + PADDING}px)`;  // 右端の場合
  }
  
  // 通常の中央位置
  return `calc(${rawPosition * 100}% - ${previewWidth / 2}px)`;
}, []);
```

## 2. サムネイル生成とキャッシュ

効率的なサムネイル生成のためにカスタムフックでキャッシュシステムを実装：

```typescript
const useThumbnailCache = (videoRef: React.RefObject) => {
  const cacheRef = useRef<Record>({});
  const canvasRef = useRef(null);
  const [videoClone, setVideoClone] = useState(null);

  // ビデオのクローンとキャンバスを作成
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 90;
    canvasRef.current = canvas;

    const clonedVideo = document.createElement('video');
    clonedVideo.src = videoRef.current?.src || '';
    document.body.appendChild(clonedVideo);
    setVideoClone(clonedVideo);

    return () => {
      clonedVideo.remove();
      cacheRef.current = {};
    };
  }, [videoRef.current?.src]);

  // キャッシュを活用したサムネイル生成
  const getThumbnail = useCallback(async (time: number) => {
    const roundedTime = Math.floor(time);
    if (cacheRef.current[roundedTime]) {
      return cacheRef.current[roundedTime];
    }

    if (!videoClone || !canvasRef.current) return null;

    return new Promise((resolve) => {
      const handleSeeked = () => {
        const context = canvasRef.current?.getContext('2d');
        if (!context) return resolve(null);

        context.drawImage(videoClone, 0, 0, 160, 90);
        const thumbnail = canvasRef.current?.toDataURL('image/jpeg', 0.5);
        
        if (thumbnail) {
          cacheRef.current[roundedTime] = thumbnail;
          resolve(thumbnail);
        }

        videoClone.removeEventListener('seeked', handleSeeked);
      };

      videoClone.addEventListener('seeked', handleSeeked);
      videoClone.currentTime = time;
    });
  }, [videoClone]);

  return getThumbnail;
};
```

## 3. チャプターマーカー

チャプターマーカーはプログレスバー上に配置され、ホバー時に情報を表示します：

```tsx
const ChapterMarker: React.FC = ({
  chapter,
  duration
}) => {
  const position = (chapter.startTime / duration) * 100;
  const [formattedTime] = formatTimePair(chapter.startTime, duration);
  
  return (
    
  );
};
```

## 4. パフォーマンス最適化

1. **イベントの制御**
```typescript
const handleMouseMove = useCallback((e: React.MouseEvent) => {
  const now = Date.now();
  if (now - lastUpdateRef.current < 50) return;  // 50ms以内の更新をスキップ
  lastUpdateRef.current = now;
  
  // 位置計算とプレビュー更新
}, [duration]);
```

2. **サムネイルのキャッシュ管理**
- 1秒単位でのサムネイル生成
- メモリ内でのキャッシュ保持
- コンポーネントのアンマウント時に自動クリーンアップ

3. **レンダリングの最適化**
- プレビューやホバー効果の条件付きレンダリング
- コールバック関数のメモ化
- 効率的な位置計算

4. **リソース管理**
```typescript
useEffect(() => {
  // セットアップ
  return () => {
    // リソースのクリーンアップ
    videoClone?.remove();
    cacheRef.current = {};
  };
}, []);
```