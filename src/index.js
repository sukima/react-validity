import { useEffect, useRef } from 'react';
import { setValidity, verifyFormValidity, validate } from './validity';

export { validate };

export function useValidity(validators, { ref = useRef(), ...options } = {}) {
  useEffect(
    () => setValidity(ref.current, validators, options),
    [ref, validators]
  );
  return ref;
}

export function useVerifyFormValidity({
  ref = useRef(),
  validated,
  ...options
} = {}) {
  useEffect(() => verifyFormValidity(ref.current, options), [ref]);
  if (validated) {
    useEffect(() => {
      let element = ref.current;
      element.addEventListener('validated', validated);
      return () => element.removeEventListener('validated', validated);
    }, [ref, validated]);
  }
  return ref;
}
