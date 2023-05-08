import React from 'react';

const useDebounce = (value: string, deplay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState<string>('');

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), deplay);

    return () => clearTimeout(handler);
  }, [value]);

  return debouncedValue;
};

export default useDebounce;
