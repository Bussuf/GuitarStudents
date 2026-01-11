import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Leads from './pages/Leads';
import Students from './pages/Students';
import Lessons from './pages/Lessons';
import Finance from './pages/Finance';
import Resources from './pages/Resources';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Settings": Settings,
    "Leads": Leads,
    "Students": Students,
    "Lessons": Lessons,
    "Finance": Finance,
    "Resources": Resources,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};