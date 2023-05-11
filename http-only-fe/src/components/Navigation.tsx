import Link from "next/link";
import React from "react";

type NavigationProps = {
  routes: { [route: string]: string };
}

export const Navigation: React.FC<NavigationProps> = ({ routes }) => (
  <ul>
    {Object.entries(routes).map(
      ([key, value]) => <li><Link href={`/${key}`}>{value}</Link></li>)}
  </ul>
);

const defaultNavigation = <Navigation routes={{
  login: "Login",
  home: "Home"
}} />;

export default () => <><h4>Navigation</h4>{defaultNavigation}</>;