import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Leads from './pages/Leads';
import Lessons from './pages/Lessons';
import MusicTaste from './pages/MusicTaste';
import Resources from './pages/Resources';
import Settings from './pages/Settings';
import Students from './pages/Students';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Finance": Finance,
    "Leads": Leads,
    "Lessons": Lessons,
    "MusicTaste": MusicTaste,
    "Resources": Resources,
    "Settings": Settings,
    "Students": Students,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};