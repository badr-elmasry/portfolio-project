import React, { useState } from "react"
import { Map, Marker } from "@vis.gl/react-google-maps"
import "./CustomMap.css"
import { useEffect } from "react"
const CustomMap = ({ hotel }) => {
	return (
		<div className="map-container">
			<Map
				defaultZoom={16}
				defaultCenter={{
					lat: hotel.location.latitude,
					lng: hotel.location.longitude,
				}}
				disableDefaultUI
			>
				<Marker
					position={{
						lat: hotel.location.latitude,
						lng: hotel.location.longitude,
					}}
				/>
			</Map>
		</div>
	)
}

export default CustomMap
