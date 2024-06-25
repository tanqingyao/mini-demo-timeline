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
};

interface RectangleProps {
  shape: PaintInfo;
  selected?: boolean;
  onChange: (x: PaintInfo) => void;
  onContextMenu?: (e: PointerEvent) => void;
  onSelect?: (shape: PaintInfo) => void;
}

export const Rectangle = (props: RectangleProps) => {
  const { shape, selected } = props;
  const { onChange, onContextMenu, onSelect } = props;
  const shapeProps = shape;
  const handleChange = (info: PaintInfo) => {
    onChange({
      ...shapeProps,
      ...info,
    });
  };

  const shapeRef = useRef<Konva.Group>(null);
  const handleSelect = () => {
    onSelect?.(shape);
  };

  const borderRadius = shapeProps.width > 2 ? 2 : 0;

  return (
    <>
      <Group
        ref={shapeRef}
        {...shapeProps}
        onContextMenu={(e) => onContextMenu?.(e.evt)}
        onMouseDown={handleSelect}
        onTap={handleSelect}
        draggable={true}
        onDragEnd={(e) => {
          const node = e.target;
          handleChange({ ...shapeProps, x: node.x(), y: node.y() });
        }}
        onTransformEnd={(e) => {
          const node = e.target;
          const scaleX = node.scaleX();
          node.scaleX(1);
          node.scaleY(1);

          handleChange({
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
      {selected && <ShapePaddle shapeRef={shapeRef} />}
    </>
  );
};
