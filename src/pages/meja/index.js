import { useState, useEffect } from "react"
import { Modal } from "bootstrap"
import axios from "axios"

const baseURL = `http://localhost:8000`
const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

const Meja = () => {
    const [id_meja, setIdMeja] = useState(0)
    const [nomor_meja, setNomorMeja] = useState("")
    const [status, setStatus] = useState(true)
    const [isEdit, setIsEdit] = useState(true)
    const [modal, setModal] = useState(null)
    const [meja, setMeja] = useState([])

    const getMeja = () => {
        const url = `${baseURL}/meja`
        axios.get(url, header)
            .then(response => { setMeja(response.data.data) })
            .catch(error => console.log(error))
    }
    const addMeja = () => {
        setIdMeja(0)
        setNomorMeja("")
        setStatus(true)
        setIsEdit(false)
        modal.show()
    }
    const editMeja = item => {
        setIdMeja(item.id_meja)
        setNomorMeja(item.nomor_meja)
        setStatus(item.status)
        setIsEdit(true)
        modal.show()
    }
    const saveMeja = event => {
        event.preventDefault()
        modal.hide()
        let payload = { id_meja, nomor_meja, status }
        if (isEdit) {
            let url = `${baseURL}/meja/${id_meja}`
            axios.put(url, payload, header)
                .then(response => {
                    window.alert(`Data meja berhasil diubah`)
                    getMeja()
                })
                .catch(error => console.log(error))
        } else {
            let url = `${baseURL}/meja`
            axios.post(url, payload, header)
                .then(response => {
                    window.alert(`Data meja berhasil ditambahkan`)
                    getMeja()
                })
                .catch(error => console.log(error))
        }
    }
    const dropMeja = (item) => {
        if (window.confirm(`Are you sure?`)) {
            const url = `${baseURL}/meja/${item.id_meja}`
            axios.delete(url, header)
                .then(response => {
                    window.alert(`Data meja berhasil dihapus`)
                    getMeja()
                })
                .catch(error => console.log(error))
        }
    }

    useEffect (() => {
        getMeja()
        setModal(new Modal(`#modal-meja`))
    }, [])

    return (
        <div className="w-100 container-fluid">
            <button className="btn btn-success mt-2 mb-3" onClick={() => addMeja()}>Tambah Meja</button>
            <ul className="list-group">
                {meja.map(table => (
                    <li className="list-group-item mb-2" key={`keyMeja${table.id_meja}`}>
                        <div className="row">
                            <div className="col-md-3">
                                <small className="text-success">
                                    Nomor Meja
                                </small><br />
                                {table.nomor_meja}
                            </div>
                            <div className="col-md-7">
                                <small className="text-success">
                                    Status
                                </small><br />
                                {table.status ? `available` : 'in use'}
                            </div>
                            <div className="col-md-2">
                                <small className="text-success">
                                    Action
                                </small><br />
                                <button className="btn btn-sm btn-warning m-1" onClick={() => editMeja(table)}>
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-danger m-1" onClick={() => dropMeja(table)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="modal fade" id="modal-meja">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <form onSubmit={saveMeja}>
                            <div className="modal-header">
                                <h4 className="modal-title">
                                    Formulir Meja
                                </h4>
                            </div>
                            <div className="modal-body">
                                <small>Nomor Meja</small>
                                <input type="text" className="form-control mb-2" value={nomor_meja} onChange={e => setNomorMeja(e.target.value)} />
                                <small>Status</small>
                                <select className="form-control mb-2" value={status} onChange={e => setStatus(e.target.value)}>
                                    <option value="">-- Pilih Meja</option>
                                    <option value={true}>Available</option>
                                    <option value={false}>In Use</option>
                                </select>
                                <button type="submit" className="btn btn-info w-100">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Meja