import { StyledA, StyledNavbar } from "../shared/styledComponents";

import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <StyledNavbar>
      <StyledA>
        <Link to="/AboutMe">About me </Link>
      </StyledA>
      <StyledA>
        <Link to="/Resume">Resume </Link>
      </StyledA>
      <StyledA>
        <Link to="/ProfessionalAccomplishments">
          Professional Accomplishments{" "}
        </Link>
      </StyledA>
      <StyledA>
        <Link to="/PersonalProjects">Personal Projects </Link>
      </StyledA>
      <StyledA>
        <Link to="/Contact">Contact </Link>
      </StyledA>
    </StyledNavbar>
  );
};

export default Navbar;
