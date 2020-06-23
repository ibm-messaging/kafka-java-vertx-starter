const stepNotImplemented = (step) => {
  // eslint-disable-next-line no-console
  const callback = () => console.error(`${step} - Not implemented yet`);
  return [step, callback];
};

export { stepNotImplemented };
