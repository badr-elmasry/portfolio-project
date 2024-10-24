export const isAuthenticated = () => {
	const isLoggedIn = localStorage.getItem("isLoggedIn")
	if (isLoggedIn === "true") {
		return true
	}
}
