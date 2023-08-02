import React from "react"

const Middleware = ({ children, roles }) => {
    if (!localStorage.getItem('token')) {
        return window.location.href = '/login'
    }
    let user = JSON.parse(localStorage.getItem("user"))
    if (roles.includes(user.role)) {
        return children
    }
    return (
        <div><h1>Forbidden Access</h1></div>
    )
}

export default Middleware