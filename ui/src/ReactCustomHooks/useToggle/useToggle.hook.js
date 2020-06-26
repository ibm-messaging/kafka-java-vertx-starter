/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';

const useToggle = (initialToggleState = false) => {
  const [toggleState, updateToggle] = useState(initialToggleState);
  const toggle = () => updateToggle(!toggleState);
  return [toggleState, toggle];
};

export { useToggle };
