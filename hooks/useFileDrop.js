//from https://medium.com/jetclosing-engineering/create-your-own-react-hook-5cae013304d2
import { useEffect, useCallback, useRef } from 'react';
import {useRecoilState} from 'recoil';
import {isDraggingState} from '../recoil/atoms';

export const useFileDrop = ({ onDrop }) => {
  const dragCount = useRef(0);
  const [isDragging, setDragging] = useRecoilState(isDraggingState);

  const onDragEnterCallback = useCallback(
    event => {
      event.preventDefault();
      dragCount.current += 1;
      if (dragCount.current > 1) {
        return;
      }
      setDragging(true);
    },
    [dragCount, setDragging]
  );

  const onDragLeaveCallback = useCallback(
    event => {
      event.preventDefault();
      dragCount.current -= 1;
      if (dragCount.current > 0) {
        return;
      }
      setDragging(false);
    },
    [dragCount, setDragging]
  );

  const onDropCallback = useCallback(
    event => {
      event.preventDefault();
      setDragging(false);
      dragCount.current = 0;
      onDrop(event);
    },
    [onDrop, dragCount, setDragging]
  );

  const onDragoverCallback = useCallback(event => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    window.addEventListener('drop', onDropCallback);
    window.addEventListener('dragover', onDragoverCallback);
    window.addEventListener('dragenter', onDragEnterCallback);
    window.addEventListener('dragleave', onDragLeaveCallback);
    return () => {
      window.removeEventListener('drop', onDropCallback);
      window.removeEventListener('dragover', onDragoverCallback);
      window.removeEventListener('dragenter', onDragEnterCallback);
      window.removeEventListener('dragleave', onDragLeaveCallback);
    };
  }, [
    onDropCallback,
    onDragoverCallback,
    onDragEnterCallback,
    onDragLeaveCallback,
  ]);

  return { isDragging };
};