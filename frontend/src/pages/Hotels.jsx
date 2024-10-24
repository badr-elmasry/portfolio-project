import React, { useState } from "react"
import { APIProvider } from "@vis.gl/react-google-maps"
import CustomMap from "./CustomMap"
import { useEffect } from "react"
import { isAuthenticated } from "../utils/auth"
import { useNavigate } from "react-router-dom"

const Hotels = () => {
	const navigate = useNavigate()
	const [hotel, setHotelData] = useState(null)
	useEffect(() => {
		const fetchHotelData = async () => {
			try {
				const response = await fetch("/api/book", { method: "POST" })
				const data = await response.json()
				setHotelData(
					data.hotels[Math.floor(Math.random() * data.hotels.length)]
				)
			} catch (error) {
				console.error("Error fetching hotel data:", error)
			}
		}

		fetchHotelData()
	}, [])

	useEffect(() => {
		if (!isAuthenticated()) {
			navigate("/login")
		}
	}, [navigate])

	const payment = () => {
		fetch("/api/create-checkout-request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				hotel,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					window.location.href = data.url
				} else {
					alert("Payment failed: " + data.message)
				}
			})
			.catch((error) => {
				console.error("Error:", error)
				alert("An error occurred. Please try again.")
			})
	}
	if (!hotel) {
		return null
	}
	return (
		<div style={{ margin: "20px" }}>
			<h1>This is the best hotel that matches your needs:</h1>
			<h3>Name: {hotel.name}</h3>
			<h3>Rating: {hotel.hotelRating}</h3>

			<APIProvider apiKey="AIzaSyD3990aNLlPg6nmjq5kGFkOyk51MRrt8Nw">
				<CustomMap hotel={hotel} />
			</APIProvider>
			<br />
			<button
				onClick={payment}
				style={{ padding: "10px 20px", fontSize: "14px", width: "30%" }}
			>
				Proceed to Payment
			</button>
		</div>
	)
}

export default Hotels
