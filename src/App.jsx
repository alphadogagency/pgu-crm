import { Routes, Route } from 'react-router-dom';
import StopSelector from './pages/StopSelector';
import StopLayout from './pages/StopLayout';
import Dashboard from './pages/Dashboard';
import CoachingSchedule from './pages/CoachingSchedule';
import CoachRoster from './pages/CoachRoster';
import KeyPersonnel from './pages/KeyPersonnel';
import Sponsors from './pages/Sponsors';
import VolunteerRoles from './pages/VolunteerRoles';
import Reminders from './pages/Reminders';
import Contacts from './pages/Contacts';
import Rollovers from './pages/Rollovers';
import EquipmentList from './pages/EquipmentList';
import RegistrationTracker from './pages/RegistrationTracker';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StopSelector />} />
      <Route path="/:stopId" element={<StopLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="schedule"     element={<CoachingSchedule />} />
        <Route path="roster"       element={<CoachRoster />} />
        <Route path="personnel"    element={<KeyPersonnel />} />
        <Route path="sponsors"     element={<Sponsors />} />
        <Route path="volunteers"   element={<VolunteerRoles />} />
        <Route path="reminders"    element={<Reminders />} />
        <Route path="contacts"     element={<Contacts />} />
        <Route path="rollovers"    element={<Rollovers />} />
        <Route path="equipment"    element={<EquipmentList />} />
        <Route path="registration" element={<RegistrationTracker />} />
      </Route>
    </Routes>
  );
}
