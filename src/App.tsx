import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './modules/Dashboard';
import { PersonaBuilder } from './modules/PersonaBuilder';
import { Templates } from './modules/Templates';
import { ComparisonView } from './modules/ComparisonView';
import { TeamLibrary } from './modules/TeamLibrary';
import { SharedPersonaView } from './modules/SharedPersonaView';
import { PresentationMode } from './modules/PresentationMode';
import { Analytics } from './modules/Analytics';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder" element={<PersonaBuilder />} />
          <Route path="templates" element={<Templates />} />
          <Route path="compare" element={<ComparisonView />} />
          <Route path="team" element={<TeamLibrary />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        <Route path="/shared/:id" element={<SharedPersonaView />} />
        <Route path="/present/:id" element={<PresentationMode />} />
      </Routes>
    </HashRouter>
  );
}

export default App;