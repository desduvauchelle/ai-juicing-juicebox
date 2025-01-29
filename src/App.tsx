import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Chat from './pages/Chat'
import Init from './pages/Init'
import Settings from './pages/Settings'


function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Init />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="/chat/:conversationId" element={<Chat />} />
				<Route path="/welcome" element={<Welcome />} />
				<Route path="/settings/*" element={<Settings />} />
				{/* Add more routes as needed */}
				<Route path="*" element={<Init />} /> {/* Catch-all route */}
			</Routes>
		</Router>
	)
}

export default App
