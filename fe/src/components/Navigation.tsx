import Link from "next/link";
import React from "react";
import styles from './Navigation.module.css';

type NavigationProps = {
  routes: { [route: string]: string };
}

export const Navigation: React.FC<NavigationProps> = ({ routes }) => (
  <div className={styles['container']}>
    <span className={styles['title']}>Navigation</span>
    <ul className={styles['ul']}>
      {Object.entries(routes).map(
        ([key, value]) => <li key={key}> <Link className={styles['link']} href={`/${key}`}>{value}</Link></li>)}
    </ul>
  </div >
);

export default () => (
  <Navigation routes={{
    login: "Login",
    home: "Home"
  }} />
);
