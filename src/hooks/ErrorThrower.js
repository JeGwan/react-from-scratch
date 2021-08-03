import { useEffect, useState } from "react";

const useErrorThrower = () => {
  const [error, setError] = useState();
  useEffect(() => {
    if (error) throw error;
  }, [error]);
  return { error, setError };
};

export default useErrorThrower;
