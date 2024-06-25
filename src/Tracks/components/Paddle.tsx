import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { Transformer } from 'react-konva';
import { round2Frame } from '../utils';

export const ShapePaddle = ({
  shapeRef,
}: {
  shapeRef: React.RefObject<Konva.Group>;
}) => {
  const trRef = useRef<Konva.Transformer>(null);
  useEffect(() => {
    if (!trRef.current || !shapeRef.current) {
      return;
    }

    // we need to attach transformer manually
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer()?.batchDraw();
  }, []);
  return (
    <Transformer
      ref={trRef}
      anchorSize={10}
      rotateEnabled={false}
      flipEnabled={false}
      enabledAnchors={['middle-left', 'middle-right']}
      anchorDragBoundFunc={(oldPos, newPos) => ({
        ...oldPos,
        x: round2Frame(newPos.x),
      })}
    />
  );
};
