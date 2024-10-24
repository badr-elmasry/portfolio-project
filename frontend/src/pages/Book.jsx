import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Book.css"
import { isAuthenticated } from "../utils/auth"
const Book = () => {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		checkIn: "",
		checkOut: "",
		guests: 1,
		rating: 1,
	})

	useEffect(() => {
		if (!isAuthenticated()) {
			navigate("/login")
		}
	}, [navigate])
	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData({
			...formData,
			[name]: value,
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		fetch("/api/book", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		})
			.then((response) => response.json())
			.then((data) => {
				navigate("/hotels", {
					state: {
						hotel: data[Math.floor(Math.random() * data.length)],
					},
				})
			})

			.catch((error) => {
				console.error("Error:", error)
			})
	}

	return (
		<div className="auth-container">
			<div className="auth-form-container">
				<h1>Book a Room</h1>
				<form onSubmit={handleSubmit}>
					<div className="input-group">
						<label>Check-In Date:</label>
						<input
							type="date"
							name="checkIn"
							value={formData.checkIn}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="input-group">
						<label>Check-Out Date:</label>
						<input
							type="date"
							name="checkOut"
							value={formData.checkOut}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="input-group">
						<label>Number of Guests:</label>
						<input
							type="number"
							name="guests"
							value={formData.guests}
							onChange={handleChange}
							min="1"
							max="10"
							required
						/>
					</div>
					<div className="input-group">
						<label>Rating:</label>
						<input
							type="number"
							name="rating"
							value={formData.rating}
							onChange={handleChange}
							min="1"
							max="5"
							required
						/>
					</div>
					<button type="submit">Book Now</button>
				</form>
			</div>
		</div>
	)
}

export default Book
