import React, { createContext, useState } from 'react';
import { NO_OP } from 'Utils';

// describe the shape of the context being created
const SelectedMessage = createContext({
  currentSelectedMessage: null,
  isSameAsSelected: NO_OP,
  updateSelectedMessage: NO_OP,
});

const generateId = ({ topic, partition, offset }) =>
  `t:{${topic}}-p:{${partition}}-o:{${offset}}`;

// eslint-disable-next-line react/prop-types
const SelectedMessageProvider = ({ children, ...others }) => {
  const [currenSelectedState, updateSelectedState] = useState(null);
  const updateSelectedMessage = (message) => {
    updateSelectedState(generateId(message));
  };

  return (
    <SelectedMessage.Provider
      {...others}
      value={{
        currentSelectedMessage: currenSelectedState,
        updateSelectedMessage,
        isSameAsSelected: (msg) => generateId(msg) === currenSelectedState,
      }}
    >
      {children}
    </SelectedMessage.Provider>
  );
};

const SelectedMessageConsumer = SelectedMessage.Consumer;

export { SelectedMessageProvider, SelectedMessageConsumer };
