import Finance from './pages/Finance';
import Leads from './pages/Leads';
import Lessons from './pages/Lessons';
import MusicTaste from './pages/MusicTaste';
import Resources from './pages/Resources';
import Settings from './pages/Settings';
import Students from './pages/Students';
import Dashboard from './pages/Dashboard';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Finance": Finance,
    "Leads": Leads,
    "Lessons": Lessons,
    "MusicTaste": MusicTaste,
    "Resources": Resources,
    "Settings": Settings,
    "Students": Students,
    "Dashboard": Dashboard,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};