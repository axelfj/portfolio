import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import AboutMe from "./tabs/aboutMe/aboutMe";
import Contact from "./tabs/contact/contact";
import Credits from "./tabs/credits/credits";
import Footer from "./banners/footer/footer";
import Navbar from "./banners/navbar/navbar";
import PersonalProjects from "./tabs/personalProjects/personalProjects";
import ProfessionalBackground from "./tabs/professionalBackground/professionalBackground";
import Resume from "./tabs/resume/resume";

const Main = () => {
  return (
    <div className="main">
      <Router>
        <Navbar />
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/AboutMe">
            <AboutMe />
          </Route>
          <Route path="/Resume">
            <Resume />
          </Route>
          <Route path="/ProfessionalAccomplishments">
            <ProfessionalBackground />
          </Route>
          <Route path="/PersonalProjects">
            <PersonalProjects />
          </Route>
          <Route path="/Contact">
            <Contact />
          </Route>
          <Route path="/Credits">
            <Credits />
          </Route>
        </Switch>
      </Router>
      <Footer />
    </div>
  );
};

export default Main;
