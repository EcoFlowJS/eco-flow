const requireUncached = (id: string): any => {
  delete require.cache[require.resolve(id)];
  return require(id);
};

export default requireUncached;
