import { useCallback, useRef } from 'react';

interface MobileControlsProps {
  onInput: (left: boolean, right: boolean) => void;
}

export function MobileControls({ onInput }: MobileControlsProps) {
  const activePointers = useRef<Map<number, 'left' | 'right'>>(new Map());

  const update = useCallback(() => {
    const dirs = [...activePointers.current.values()];
    onInput(dirs.includes('left'), dirs.includes('right'));
  }, [onInput]);

  const getSide = (clientX: number): 'left' | 'right' => {
    return clientX < window.innerWidth / 2 ? 'left' : 'right';
  };

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    activePointers.current.set(e.pointerId, getSide(e.clientX));
    target.setPointerCapture(e.pointerId);
    update();
  }, [update]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!activePointers.current.has(e.pointerId)) return;
    const newSide = getSide(e.clientX);
    if (activePointers.current.get(e.pointerId) !== newSide) {
      activePointers.current.set(e.pointerId, newSide);
      update();
    }
  }, [update]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    activePointers.current.delete(e.pointerId);
    update();
  }, [update]);

  return (
    <div
      className="absolute left-0 right-0 bottom-0 z-10 pointer-events-auto touch-none"
      style={{ height: '50%', WebkitTapHighlightColor: 'transparent' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="absolute inset-0 flex">
        <div className="flex-1" />
        <div className="flex-1" />
      </div>
    </div>
  );
}
