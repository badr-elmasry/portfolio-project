import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"

const Login = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const navigate = useNavigate()

	const handleSubmit = (e) => {
		e.preventDefault()
		fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.message === "Login successful") {
					localStorage.setItem("isLoggedIn", true)
					navigate("/book")
				} else {
					alert("Login failed: " + data.message)
				}
			})
			.catch((error) => {
				console.error("Error:", error)
				alert("An error occurred. Please try again.")
			})
	}

	return (
		<div className="auth-container">
			<div className="auth-form-container">
				<h2>Login</h2>
				<form
					className="auth-form"
					action="#"
					method="POST"
					onSubmit={handleSubmit}
				>
					<div className="input-group">
						<input
							type="email"
							placeholder="Email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="input-group">
						<input
							type="password"
							placeholder="Password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<button type="submit">Login</button>
					<p className="auth-link">
						Don't have an account? <a href="/register">Register</a>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Login
