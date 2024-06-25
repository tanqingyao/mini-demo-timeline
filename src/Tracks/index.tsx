import type Konva from 'konva';
import { Group, Layer, Stage, Rect } from 'react-konva';
import { useRef, useState } from 'react';
import { Rectangle } from './components/Rectangle';
import { updateSegment, useSegmentList, useTrackList } from './store';

// 鼠标拖拽样式
const changeMouseCursor =
  (type: string) => (e: Konva.KonvaEventObject<MouseEvent>) => {
    const container = e.target.getStage()?.container();
    if (container) {
      container.style.cursor = type;
    }
  };

export const Tracks = () => {
  // 画布大小
  const stageWidth = window.innerWidth - 200;
  const stageHeight = 200;
  const stageRef = useRef<Konva.Stage>(null);

  const [selectedId, setSelectedId] = useState('');

  const trackList = useTrackList();
  const segmentList = useSegmentList();
  return (
    <Stage
      ref={stageRef}
      width={stageWidth}
      height={stageHeight}
      onContextMenu={(e) => e.evt.preventDefault()}
    >
      <Layer
        onMouseDown={() => setSelectedId('')}
        onTouchStart={() => setSelectedId('')}
      >
        <Rect width={stageWidth} height={stageHeight} fill="transparent" />
        {trackList.map((track) => (
          <Rect
            key={track.id}
            x={track.x}
            y={track.y}
            width={stageWidth}
            height={track.height}
            fill="#f1f1f1"
          />
        ))}
      </Layer>
      <Layer>
        <Group
          onMouseEnter={changeMouseCursor('grab')}
          onMouseDown={changeMouseCursor('grabbing')}
          onMouseUp={changeMouseCursor('grab')}
          onMouseLeave={changeMouseCursor('default')}
        >
          {segmentList.map((shape) => (
            <Rectangle
              key={shape.id}
              shape={shape}
              selected={selectedId === shape.id}
              onSelect={(shape) => {
                setSelectedId(shape.id);
              }}
              onChange={(segment) => updateSegment(segment)}
            />
          ))}
        </Group>
      </Layer>
    </Stage>
  );
};
