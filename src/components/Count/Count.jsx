import styles from "./Count.module.scss";
import React, { useCallback, useEffect, useState } from "react";
import useErrorThrower from "../../hooks/ErrorThrower";

const Count = () => {
  const [count, setCount] = useState(0);
  const { setError } = useErrorThrower();
  const byErrorThrower = () => {
    try {
      throw Error("이벤트 핸들러에서");
    } catch (e) {
      setError(e);
    }
  };

  const throwError = () => {
    throw Error("이벤트 핸들러에서");
  };
  const handlePlus = useCallback(() => setCount((prev) => prev + 1), []);
  const handleMinus = useCallback(() => setCount((prev) => prev - 1), []);

  useEffect(() => {
    if (count > 6) throw Error("useEffect 에서");
  }, [count]);

  if (count < -1) throw Error("FC 내부에서");
  return (
    <div>
      <div className={styles.count}>{count}😀</div>
      <div className={styles.buttons}>
        <button onClick={handlePlus}>됩니까?~! 😀</button>
        <button onClick={handleMinus}>Minus 😡</button>
        <button onClick={throwError}>throwError</button>
        <button onClick={byErrorThrower}>byErrorThrower</button>
      </div>
    </div>
  );
};

export default Count;
