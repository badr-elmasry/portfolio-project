import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home.jsx"
import Book from "./pages/Book.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Hotels from "./pages/Hotels.jsx"
import "./App.css"

function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/book" element={<Book />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/hotels" element={<Hotels />} />
					<Route path="*" element={<h1>Not Found</h1>} />
				</Routes>
			</div>
		</Router>
	)
}

export default App
