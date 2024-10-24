import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Register.css"

const Register = () => {
	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [address, setAddress] = useState("")
	const [favouritePlace, setFavouritePlace] = useState("")
	const navigate = useNavigate()

	const handleSubmit = (e) => {
		e.preventDefault()
		if (password != confirmPassword) {
			alert("Passwords do not match")
			return
		}
		fetch("/api/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				email,
				password,
				confirmPassword,
				address,
				favouritePlace,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					navigate("/login")
				} else {
					alert(data.message)

					if (data.message === "User registered successfully") {
						navigate("/book")
					}
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
				<h2>Register</h2>
				<form className="auth-form" onSubmit={handleSubmit}>
					<div className="input-group">
						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="input-group">
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="input-group"></div>
					<div className="input-group">
						<input
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="input-group">
						<input
							type="password"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>
					<div className="input-group">
						<input
							type="text"
							placeholder="Address"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							required
						/>
					</div>
					<div className="input-group">
						<input
							type="text"
							placeholder="Favourite Place"
							value={favouritePlace}
							onChange={(e) => setFavouritePlace(e.target.value)}
							required
						/>
					</div>
					<button type="submit">Register</button>
					<p className="auth-link">
						Already have an account? <a href="/login">Login</a>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Register
