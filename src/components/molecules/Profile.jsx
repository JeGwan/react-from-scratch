import styles from "./Profile.module.scss";
import React from "react";

const Profile = () => {
  return (
    <div className={styles.profile}>
      <div className={styles.thumb}>👨</div>
      <div className={styles.info}>
        <dl>
          <dt>나이</dt>
          <dd>34</dd>
        </dl>
        <dl>
          <dt>이름</dt>
          <dd>오제관</dd>
        </dl>
      </div>
    </div>
  );
};

export default Profile;
