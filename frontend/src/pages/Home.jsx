import React from "react"
import { Link } from "react-router-dom"
import "./Home.css"

const Home = () => {
	return (
		<div style={{ margin: "20px" }}>
			<h1>Welcome to Our Hotel</h1>
			<div style={{ marginTop: "10px" }}>
				<Link to="/login">
					<button style={{ marginRight: "10px" }}>Login</button>
				</Link>
				<br />
				<Link to="/register">
					<button style={{ marginTop: "10px" }}>Register</button>
				</Link>
			</div>
		</div>
	)
}

export default Home
