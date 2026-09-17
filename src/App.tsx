// HashRouter so the demo works on static hosts (GitHub Pages) with no server rewrites.
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import FakePay from './screens/FakePay';
import Congrats from './screens/Congrats';
import SignIn from './screens/SignIn';
import Connecting from './screens/Connecting';
import ScanResults from './screens/ScanResults';
import ContactMethod from './screens/ContactMethod';
import PhoneNumber from './screens/PhoneNumber';
import Confirmation from './screens/Confirmation';
import Dashboard from './screens/Dashboard';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<FakePay />} />
        <Route path="/congrats" element={<Congrats />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/connecting" element={<Connecting />} />
        <Route path="/scan-results" element={<ScanResults />} />
        <Route path="/contact-method" element={<ContactMethod />} />
        <Route path="/phone" element={<PhoneNumber />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
