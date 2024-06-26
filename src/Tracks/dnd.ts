let dragInfo:
  | {
      type: 'text' | 'video';
    }
  | undefined = undefined;

export const dragHandler = () => {
  const setDragInfo = (type: 'text' | 'video') => {
    dragInfo = { type };
  };

  const getDragInfo = () => {
    const info = dragInfo;
    dragInfo = undefined;
    return info;
  };

  return { setDragInfo, getDragInfo };
};
