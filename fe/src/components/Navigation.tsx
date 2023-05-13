import Link from "next/link";
import React from "react";

type NavigationProps = {
  routes: { [route: string]: string };
}

export const Navigation: React.FC<NavigationProps> = ({ routes }) => (
  <ul>
    {Object.entries(routes).map(
      ([key, value]) => <li key={key}><Link href={`/${key}`}>{value}</Link></li>)}
  </ul>
);

export default () => (<>
  <h4>Navigation</h4>
  <Navigation routes={{
    login: "Login",
    home: "Home"
  }} />
</>);
