import styled from "styled-components";

const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "2560px",
};
export const device = {
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  laptop: `(max-width: ${size.laptop})`,
  laptopL: `(max-width: ${size.laptopL})`,
  desktop: `(max-width: ${size.desktop})`,
  desktopL: `(max-width: ${size.desktop})`,
};

export const StyledNavbar = styled.div`
  background-color: #b9b9b9;
  height: 5vh;
  display: flex;
  justify-content: center;
  vertical-align: bottom;

  @media ${device.tablet} {
    flex-direction: column;
    margin-top: 200px;
  }
`;

export const StyledA = styled.a`
  color: inherit;
  text-decoration: none;
  margin: 10px 20px 0px 10px;
  font-size: 18px;
`;
