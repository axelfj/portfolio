import {
  Link,
  Route,
  BrowserRouter as Router,
  Switch,
  useParams,
  useRouteMatch,
} from "react-router-dom";

import AboutMe from "./tabs/aboutMe";
import Contact from "./tabs/contact";
import Navbar from "./banners/navbar";
import PersonalProjects from "./tabs/personalProjects";
import ProfessionalBackground from "./tabs/professionalBackground";
import Resume from "./tabs/resume";

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
            {" "}
            <Resume />{" "}
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
        </Switch>
      </Router>
    </div>
  );
};

export default Main;
