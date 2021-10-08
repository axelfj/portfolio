import Link from "../shared/link";
import { StyledNavbar } from "../shared/styledComponents";

const Navbar = () => {
  return (
    <StyledNavbar>
      <Link url="/AboutMe" name="About Me" />
      <Link url="/Resume" name="Resume" />
      <Link
        url="/ProfessionalAccomplishments"
        name="Professional Accomplishments"
      />
      <Link url="/PersonalProjects" name="Personal Projects" />
      <Link url="/Contact" name="Contact" />
    </StyledNavbar>
  );
};

export default Navbar;
