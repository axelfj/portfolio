import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";

interface ILinkProps {
  url: string;
  name: string;
}
const StyledLink = styled.link`
  text-decoration: none;
  color: black;
`;

const Link: FC<ILinkProps> = ({ url, name }) => {
  return (
    <RouterLink component={StyledLink} to={url}>
      {name}
    </RouterLink>
  );
};

export default Link;
