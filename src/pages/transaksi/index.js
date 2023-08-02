import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const baseURL = `http://localhost:8000`
const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

const Transaksi = () => {
    const [transaksi, setTransaksi] = useState([])
    const [menu, setMenu] = useState([])
    const [meja, setMeja] = useState([])
    const user = JSON.parse(localStorage.getItem('user'))
    const [id_user, setIdUser] = useState(user.id_user)
    const [tgl_transaksi, setTglTransaksi] = useState("")
    const [nama_pelanggan, setNamaPelanggan] = useState("")
    const [id_meja, setIdMeja] = useState("")
    const [detail_transaksi, setDetailTransaksi] = useState([])
    const [id_menu, setIdMenu] = useState("")
    const [jumlah, setJumlah] = useState(0)
    const [modal, setModal] = useState(null)
    const [role, setRole] = useState("")
    const [searchKasir, setSearchKasir] = useState("")
    const [searchDate, setSearchDate] = useState("")
    const [filteredData, setFilteredData] = useState([])

    const getTransaksi = () => {
        const url = `${baseURL}/transaksi`
        axios.get(url, header)
            .then(response => {
                setTransaksi(response.data.data)
                setFilteredData(response.data.data)
            })
            .catch(error => console.log(error))
    }
    const getMenu = () => {
        const url = `${baseURL}/menu`
        axios.get(url, header)
            .then(response => {
                setMenu(response.data.data)
            })
            .catch(error => console.log(error))
    }
    const getMeja = () => {
        const url = `${baseURL}/meja/available`
        axios.get(url, header)
            .then(response => {
                setMeja(response.data.data)
            })
            .catch(error => console.log(error))
    }
    const addMenu = () => {
        let selectedMenu = menu.find(item => item.id_menu == id_menu)
        let newItem = { ...selectedMenu, jumlah: jumlah }
        let tempDetail = [...detail_transaksi]
        tempDetail.push(newItem)
        setDetailTransaksi(tempDetail)
        setIdMenu("")
        setJumlah(0)
    }
    const handleSaveTransaksi = event => {
        event.preventDefault()
        if (nama_pelanggan === "" || id_meja === "" || tgl_transaksi === "" || detail_transaksi.length == 0) {
            window.alert(`Lengkapi formulir pemesanan`)
        } else {
            const url = `${baseURL}/transaksi`
            const payload = {
                tgl_transaksi, id_meja, id_user, nama_pelanggan, detail_transaksi
            }
            axios.post(url, payload, header)
                .then(response => {
                    window.alert(`Data Transaksi berhasil Ditambahkan`)
                    modal.hide()

                    setTglTransaksi("")
                    setIdMeja("")
                    setIdMenu("")
                    setJumlah(0)
                    setNamaPelanggan("")
                    setDetailTransaksi([])

                    getTransaksi()
                    getMeja()
                })
                .catch(error => console.log(error))
        }
    }
    const handleDelete = item => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus transaksi ini?`)) {
            const url = `${baseURL}/transaksi/${item.id_transaksi}`
            axios.delete(url, header)
                .then(response => getTransaksi())
                .catch(error => console.log(error))
        }
    }
    const handlePay = item => {
        if (window.confirm(`Apakah Anda yakin ingin membayar transaksi ini?`)) {
            const url = `${baseURL}/transaksi/pembayaran/${item.id_transaksi}`
            const payload = { ...item }
            axios.put(url, payload, header)
                .then(response => getTransaksi())
                .catch(error => console.log(error))
        }
        window.location.reload()
    }
    const handleFilter = () => {
        if(searchKasir === "" && searchDate === ""){
            setFilteredData(transaksi)
            return;
        }
        let filteredData = transaksi.filter((transaksi) => {
            let tgl_transaksi = new Date(transaksi.tgl_transaksi).toISOString().split(`T`)[0]
            if (searchKasir !== "" && searchDate === "") {
                return transaksi.user.nama_user.includes(searchKasir)
            } else if (searchDate !== "" && searchKasir === "") {
                return tgl_transaksi === searchDate
            } else {
                return tgl_transaksi = searchDate && transaksi.user.nama_user.includes(searchKasir)
            }
        })
        setFilteredData(filteredData)
    }
    async function searching(e) {
        try {
            if (e.keyCode == 13) {
                handleFilter()
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleFilter()
    }, [searchDate])

    useEffect(() => {
        getTransaksi()
        getMenu()
        getMeja()
        let user = JSON.parse(localStorage.getItem("user"))
        setRole(user?.role)

        setModal(new Modal(`#modal-transaksi`))
    }, [])
    return (
        <div className="w-100 container-fluid">
            {role === "kasir" &&
                <button className="btn btn-danger mt-2 mb-3" onClick={() => {
                    modal.show()
                    let day = new Date(new Date()).toISOString().substring(0, 10)
                    setTglTransaksi(day)
                }}>Transaksi Baru</button>
            }
            {role === "manajer" &&
                <div className="row">
                    <div className="mb-3 pt-2 col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Cari Kasir"
                            value={searchKasir}
                            onKeyUp={e => searching(e)}
                            onChange={e => setSearchKasir(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 pt-2 col-md-3">
                        <input
                            type="date"
                            className="form-control"
                            placeholder="Cari Tanggal Transaksi"
                            value={searchDate}
                            onChange={e => setSearchDate(e.target.value)}
                        />

                    </div>
                </div>
            }
            <ul className="list-group">
                {filteredData
                    .map((item, index) => (
                        <li className="list-group-item mb-2" style={{ backgroundColor: "#e1d8c7" }} key={`tran${index}`}>
                            <div className="row">
                                <div className="col-md-2">
                                    <small className="text-success">Nama Kasir</small><br />{item.user.nama_user}
                                </div>
                                <div className="col-md-3">
                                    <small className="text-success">Tgl. Transaksi</small><br />{item.tgl_transaksi}
                                </div>
                                <div className="col-md-2">
                                    <small className="text-success">Nama Pelanggan</small><br />{item.nama_pelanggan}
                                </div>
                                <div className="col-md-1">
                                    <small className="text-success">Meja</small><br />Meja {item.meja.nomor_meja}
                                </div>
                                <div className="col-md-2">
                                    <small className="text-success">Status</small><br /><span className={`badge ${item.status === 'belum_bayar' ? 'bg-danger' : 'bg-success'}`}>{item.status}</span><br />
                                </div>
                                <div className="col-md-2">
                                    <small className="text-success">
                                        Total
                                    </small><br />
                                    Rp{item.detail_transaksi.reduce((sum, obj) =>
                                        Number(sum) + (obj["jumlah"] * obj["harga"]), 0
                                    )}
                                </div>
                                {role === "kasir" &&
                                    <div className="col-md-1">
                                        <small></small><br />
                                        {item.status === 'belum_bayar' ? <>
                                            <button className="btn btn-sm btn-success" onClick={() => handlePay(item)}>Pembayaran</button></> : <><button className="btn btn-sm btn-danger" onClick={() => handleDelete(item)}>Delete</button></>}
                                    </div>
                                }
                            </div>
                            <div className="mt-3">
                                <h5>Detail Transaksi</h5>
                                <ul className="list-group">
                                    {item.detail_transaksi.map((detail) => (
                                        <li className="list-group-item" key={`detail${item.id_transaksi}`}>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <small className="text-success">Nama Menu</small><br />
                                                    {detail.menu.nama_menu}
                                                </div>
                                                <div className="col-md-2">
                                                    <small className="text-success">Jumlah Pesanan</small><br />
                                                    {detail.jumlah} pcs
                                                </div>
                                                <div className="col-md-3">
                                                    <small className="text-success">Harga Satuan</small><br />
                                                    Rp{detail.harga}
                                                </div>
                                                <div className="col-md-3">
                                                    <small className="text-success">Total Harga</small><br />
                                                    Rp{Number(detail.harga) * Number(detail.jumlah)}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
            </ul>
            <div className="modal fade" id="modal-transaksi">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={handleSaveTransaksi}>
                            <div className="modal-header">
                                <h4 className="modal-titile">
                                    Form Transaksi
                                </h4>
                                <small>
                                    Tambahkan Pesanan Anda
                                </small>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <small className="text-info">
                                            Nama Pelanggan
                                        </small>
                                        <input type="text" className="form-control mb-2" value={nama_pelanggan} onChange={e => setNamaPelanggan(e.target.value)} />
                                    </div>
                                    <div className="col-md-4">
                                        <small>Pilih Meja</small>
                                        <select className="form-control mb-2" value={id_meja} onChange={e => setIdMeja(e.target.value)}>
                                            <option value="">-- Pilih Meja --</option>
                                            {meja.map(table => (
                                                <option value={table.id_meja} key={`keyMeja${table.id_meja}`}>Meja {table.nomor_meja}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-info">
                                            Tanggal Transaksi
                                        </small>
                                        <input type="date" className="form-control mb-2" value={tgl_transaksi} onChange={e => setTglTransaksi(e.target.value)} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8">
                                        <small className="text-info">
                                            Pilih Menu
                                        </small>
                                        <select className="form-control mb-2" value={id_menu} onChange={e => setIdMenu(e.target.value)}>
                                            <option value="">Pilih Menu</option>
                                            {menu.map((item, index) => (
                                                <option value={item.id_menu} key={`keyMenu${index}`}>
                                                    {item.nama_menu}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <small className="text-info">
                                            Jumlah
                                        </small>
                                        <input type="number" className="form-control md-2" value={jumlah} onChange={e => setJumlah(e.target.value)} />
                                    </div>
                                    <div className="col-md-2">
                                        <small className="text-info">
                                            Action
                                        </small><br />
                                        <button type="button" className="btn tbn-sm btn-success" onClick={() => addMenu()}>Tambahkan</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <h5>Detail Transaksi</h5>
                                    <ul className="list-group">
                                        {detail_transaksi.map((detail) => (
                                            <li className="list-group-item" key={`detail${detail.id_menu}`}>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <small className="text-success">Nama Menu</small><br />
                                                        {detail.nama_menu}
                                                    </div>
                                                    <div className="col-md-2">
                                                        <small className="text-success">Jumlah Pesanan</small><br />
                                                        {detail.jumlah} pcs
                                                    </div>
                                                    <div className="col-md-3">
                                                        <small className="text-success">Harga Satuan</small><br />
                                                        Rp{detail.harga}
                                                    </div>
                                                    <div className="col-md-3">
                                                        <small className="text-success">Total Harga</small><br />
                                                        Rp{Number(detail.harga) * Number(detail.jumlah)}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button type="submit" className="w-100 btn btn-success my-2">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transaksi