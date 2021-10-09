import "./navbar.scss";

import Link from "../../shared/link/link";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link url="/AboutMe" name="About Me" />
      <Link url="/Resume" name="Resume" />
      <Link
        url="/ProfessionalAccomplishments"
        name="Professional Accomplishments"
      />
      <Link url="/PersonalProjects" name="Personal Projects" />
      <Link url="/Contact" name="Contact" />
      <Link url="/Credits" name="Credits" />
    </div>
  );
};

export default Navbar;
