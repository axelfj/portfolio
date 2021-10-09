import "./link.scss";

import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";

interface ILinkProps {
  url: string;
  name: string;
}

const Link: FC<ILinkProps> = ({ url, name }) => {
  return (
    <RouterLink to={url} className={"sharedLink"}>
      {name}
    </RouterLink>
  );
};

export default Link;
