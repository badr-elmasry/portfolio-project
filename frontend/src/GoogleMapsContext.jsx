import React from "react"
import CustomMap from "./CustomMap"
import { APIProvider } from "@vis.gl/react-google-maps"
import "./App.css"

const App = () => {
	return (
		<div className="app">
			<APIProvider apiKey="AIzaSyD3990aNLlPg6nmjq5kGFkOyk51MRrt8Nw">
				<CustomMap />
			</APIProvider>
		</div>
	)
}

export default App
