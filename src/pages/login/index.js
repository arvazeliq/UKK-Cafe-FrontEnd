import React, { useEffect, useState } from "react";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const handleLogin = event => {
        event.preventDefault()
        let payLoad = { username, password }
        let url = `http://localhost:8000/authentication`
        axios.post(url, payLoad)
            .then(response => {
                if (response.data.status === true) {
                    let token = response.data.token
                    let user = response.data.data

                    localStorage.setItem('token', token)
                    localStorage.setItem('user', JSON.stringify(user))
                    window.alert(`Login Berhasil`)
                    window.location.href = "/home"
                } else {
                    window.alert(`Wrong username or password`)
                }
            })
            .catch(error => {
                window.alert(error)
            })
    }

    return (
        <div style={{backgroundImage: 'url(/loginBackground.jpg)', backgroundRepeat: false, backgroundSize: 'cover'}} className="vw-100 vh-100 d-flex justify-content-center align-items-center">
            <div className="col-md-6 p-5 shadow border rounded-2 bg-white">
                <h2 className="text-center">WIKUSAMA<span className="ms-2 text-danger">CAFE</span></h2>
                <form onSubmit={handleLogin} className="mt-5">
                    <input type="text" className="form-control mt-2" required={true} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}></input>
                    <input type="password" className="form-control mt-2" required={true} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}></input>
                    <button type="submit" className="btn w-100 mt-4 bg-black text-white">LOGIN</button>
                </form>
            </div>
        </div>
    )
}

export default Login