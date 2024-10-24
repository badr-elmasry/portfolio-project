const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const session = require("express-session")
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, "../frontend/dist")))
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
)
mongoose
	.connect(process.env.MONGODB_URI, {})
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Could not connect to MongoDB", err))

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	address: { type: String, required: true },
	favouritePlace: { type: String, required: true },
})

const Hotel = mongoose.model(
	"Hotel",
	new mongoose.Schema({
		name: String,
		lat: String,
		lng: String,
		price: Number,
		rating: Number,
	})
)

const User = mongoose.model("User", userSchema)

const authMiddleware = async (req, res, next) => {
	if (!req.session.userId) {
		return res.status(401).json({ message: "Unauthorized" })
	}
	next()
}

app.post("/register", async (req, res) => {
	try {
		const {
			username,
			password,
			confirmPassword,
			email,
			address,
			favouritePlace,
		} = req.body
		const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
		if (!usernameRegex.test(username)) {
			return res.status(400).json({
				message:
					"Username must be 3-30 characters long and can only contain letters, numbers, and underscores",
			})
		}
		if (password !== confirmPassword) {
			return res.status(400).json({ message: "Passwords do not match" })
		}
		if (password.length < 6) {
			return res.status(400).json({
				message: "Password must be at least 6 characters long",
			})
		}
		const existingUser = await User.findOne({
			$or: [{ username }, { email }],
		})
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Username or email already exists" })
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const user = new User({
			username,
			password: hashedPassword,
			email,
			address,
			favouritePlace,
		})

		await user.save()

		res.status(201).json({ message: "User registered successfully" })
	} catch (err) {
		console.log(err)
		res.status(500).json({ message: "Error registering user" })
	}
})

app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (!user) {
			return res
				.status(400)
				.json({ message: "Invalid email or password" })
		}
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res
				.status(400)
				.json({ message: "Invalid email or password" })
		}
		req.session.userId = user._id
		res.status(200).json({ message: "Login successful", success: true })
	} catch (err) {
		if (!res.headersSent) {
			res.status(500).json({ message: "Error logging in" })
		}
	}
})

app.post("/book", authMiddleware, async (req, res) => {
	const hotels = await Hotel.find()

	res.json({ hotels: hotels })
})

app.post("/create-checkout-request", authMiddleware, async (req, res) => {
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: {
						name: "Hotel Booking",
					},
					unit_amount: 99.9 * 100,
				},
				quantity: 1,
			},
		],
		mode: "payment",
		success_url: `${process.env.CLIENT_URL}/success`,
		cancel_url: `${process.env.CLIENT_URL}/cancel`,
	})

	res.json({ success: true, url: session.url })
})

app.post("/payment", authMiddleware, async (req, res) => {
	const session = await stripe.checkout.sessions.retrieve(req.body.session_id)
	if (session.payment_status === "paid") {
		res.json({ success: true })
	} else {
		res.json({ success: false })
	}
})

app.get("/success", (req, res) => {
	res.send("Payment successful")
})
app.get("/cancel", (req, res) => {
	res.send("Payment cancelled")
})

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"))
})
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
