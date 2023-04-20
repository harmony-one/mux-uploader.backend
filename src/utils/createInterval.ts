export const createInterval = (fn: Function, timeout: number): Function => {
  const rerun = async () => {
    await fn().catch(() => "");
    setTimeout(rerun, timeout);
  };

  return rerun;
};
