import React from 'react';
const useElementOnScreen = (options: any, targetRef: any) => {
  
  const [isVisibile, setIsVisible] = React.useState();
  const callbackFunction = (entries: any) => {
    const [entry] = entries; //const entry = entries[0]
    setIsVisible(entry.isIntersecting);
  };
  const optionsMemo = React.useMemo(() => {
    return options;
  }, [options]);
  React.useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, optionsMemo);
    const currentTarget = targetRef.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [targetRef, optionsMemo]);
  return isVisibile;
};
export default useElementOnScreen;
