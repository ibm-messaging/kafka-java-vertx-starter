import { useState } from 'react';

const useToggle = (initialToggleState = false) => {
  const [toggleState, updateToggle] = useState(initialToggleState);
  const toggle = () => updateToggle(!toggleState);
  return [toggleState, toggle];
};

export { useToggle };
