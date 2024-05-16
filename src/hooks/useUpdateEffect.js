import { useEffect, useRef } from 'react';
import { isEqual } from 'lodash';

function useUpdateEffect(callback, dependencies) {
  const currentDependenciesRef = useRef();

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }

  useEffect(callback, [currentDependenciesRef.current]);
}
export default useUpdateEffect;
