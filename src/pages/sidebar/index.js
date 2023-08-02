import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

const Sidebar = ({title, children}) => {
    const [username, setUsername] = useState("")
    const [role, setRole] = useState("")
    const handleLogOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('logged')
        localStorage.removeItem('role')
        window.location.href = "/login"
    }
    useEffect(() => {
        let data = JSON.parse(localStorage.getItem('user'))
        setUsername(data?.nama_user)
        setRole(data?.role)
    },[])
    return (
        <div className="container-fluid">
            <div className="row no-wrap">
                <div className="col-2 vh-100 sticky-top" style={{ backgroundColor: '#232025' }}>
                    <div className="w-100 d-flex justify-content-center my-5">
                        <img src="/logo.png" style={{ width: '100px' }} />
                    </div>
                    <div className="w-100 p-3 text-center text-white">
                        <h5 className="m-1 mb-2">{username}</h5>
                        Role : {role}
                    </div>
                    <div className="w-100 mt-4 ps-3 p-1 d-flex flex-column">
                        <Link className={`w-100 p-2 text-start text-white text-decoration-none h6 ${['admin','kasir','manajer'].includes(role)? 'd-block':'d-none'}`} to="/home">
                            <i className="bi bi-house me-2">
                                Home
                            </i>
                        </Link>
                        <Link className={`w-100 p-2 text-start text-white text-decoration-none h6 ${['admin'].includes(role)? 'd-block':'d-none'}`} to="/user">
                            <i className="bi bi-people me-2">
                                User
                            </i>
                        </Link>
                        <Link className={`w-100 p-2 text-start text-white text-decoration-none h6 ${['admin'].includes(role)? 'd-block':'d-none'}`} to="/table">
                            <i className="bi bi-house me-2">
                                Table
                            </i>
                        </Link>
                        <Link className={`w-100 p-2 text-start text-white text-decoration-none h6 ${['admin'].includes(role)? 'd-block':'d-none'}`} to="/menu">
                            <i className="bi bi-list-task me-2">
                                Menu
                            </i>
                        </Link>
                        <Link className={`w-100 p-2 text-start text-white text-decoration-none h6 ${['kasir', 'manajer'].includes(role)? 'd-block':'d-none'}`} to="/transaksi">
                            <i className="bi bi-receipt me-2">
                                Transaksi
                            </i>
                        </Link>
                        <Link className={`w-100 p-2 text-start text-white text-decoration-none h6 mt-4 ${['admin','kasir','manajer'].includes(role)? 'd-block':'d-none'}`} to="/login" onClick={() => handleLogOut()}>
                            <i className="bi bi-door-open me-2">
                                Log-Out
                            </i>
                        </Link>
                    </div>
                </div>
                <div className="col p-0 min-vh-100">
                    <div className="w-100 p-3 bg-black text-white sticky-top">
                        <h4>{title}</h4>
                    </div>
                    <div className="w-100" >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Sidebar