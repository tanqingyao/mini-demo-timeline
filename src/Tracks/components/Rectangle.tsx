import { useRef } from 'react';
import type Konva from 'konva';
import { Rect, Group } from 'react-konva';
import { ShapePaddle } from './Paddle';

export type PaintInfo = {
  id: string;
  type: string;
  fill?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  updateTime?: number; // using timestamp force update
};

interface RectangleProps {
  shape: PaintInfo;
  selected?: boolean;
  onTransformEnd?: (x: PaintInfo) => void;
  onDragEnd?: (x: PaintInfo) => void;
  onContextMenu?: (e: PointerEvent) => void;
  onSelect?: (shape: PaintInfo) => void;
}

export const Rectangle = (props: RectangleProps) => {
  const { shape, selected } = props;
  const { onTransformEnd, onDragEnd, onContextMenu, onSelect } = props;
  const shapeProps = shape;

  const shapeRef = useRef<Konva.Group>(null);
  const handleSelect = () => {
    onSelect?.(shape);
  };

  const borderRadius = shapeProps.width > 2 ? 2 : 0;

  // 用于更新 react 更新组件，若直接操作node则不需要
  const reactNodeKey = shape.updateTime;

  return (
    <>
      <Group
        key={reactNodeKey + shape.id}
        ref={shapeRef}
        {...shapeProps}
        onContextMenu={(e) => onContextMenu?.(e.evt)}
        onMouseDown={handleSelect}
        onTap={handleSelect}
        draggable={true}
        onDragEnd={(e) => {
          const node = e.target;
          onDragEnd?.({ ...shapeProps, x: node.x(), y: node.y() });
        }}
        onTransformEnd={(e) => {
          const node = e.target;
          const scaleX = node.scaleX();
          node.scaleX(1);
          node.scaleY(1);

          onTransformEnd?.({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleX,
          });
        }}
      >
        <Rect
          width={shapeProps.width}
          height={shapeProps.height}
          cornerRadius={borderRadius}
          opacity={selected ? 1 : 0.5}
          strokeWidth={1}
          fill={shape.fill}
        />
      </Group>
      {selected && (
        <ShapePaddle shapeRef={shapeRef} key={reactNodeKey + 'ShapePaddle'} />
      )}
    </>
  );
};
