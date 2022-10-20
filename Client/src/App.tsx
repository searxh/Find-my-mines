import React from "react";
import { Routes, Route } from "react-router-dom";
import Name from "./pages/Name";
import Menu from "./pages/Menu";
import Admin from "./pages/Admin";
import Game from "./pages/Game";
import HowToPlay from "./pages/HowToPlay";

function App() {
	return (
		<Routes>
			<Route path='/' element={<Name />} />
			<Route path='/menu' element={<Menu />} />
			<Route path='/game' element={<Game />} />
			<Route path='/admin' element={<Admin />} />
			<Route path='/howtoplay' element={<HowToPlay />} />
		</Routes>
	);
}

export default App;
