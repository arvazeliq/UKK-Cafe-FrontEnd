import React from 'react'
import MenuItem from './menu-item'
import { useState, useEffect } from 'react'
import { Modal } from 'bootstrap'

import axios from 'axios'
const baseURL = "http://localhost:8000"
const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

export default function Menu() {
    const [menus, setMenus] = useState([])

    const [id_menu, setIdMenu] = useState(100)
    const [nama_menu, setNamaMenu] = useState("")
    const [jenis, setJenis] = useState("")
    const [deskripsi, setDeskripsi] = useState("")
    const [harga, setHarga] = useState(0)
    const [gambar, setGambar] = useState(undefined)

    const [modal, setModal] = useState(undefined)
    const [edit, setEdit] = useState(true)

    const [keyword, setKeyword] = useState("")


    async function getMenu() {
        try {
            let url = `${baseURL}/menu`
            let { data } = await axios.get(url, header)
            setMenus(data.data)
        } catch (error) {
            console.log(error);
        }
    }
    async function searchingMenu(e) {
        try {
            if (e.keyCode == 13) {
                let url = `${baseURL}/menu/find`
                let dataSearch = {
                    keyword: keyword
                }
                let { data } = await axios.post(url, dataSearch, header)
                setMenus(data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function addMenu() {
        modal.show()

        setIdMenu(0)
        setNamaMenu("")
        setDeskripsi("")
        setHarga(0)
        setJenis("")
        setGambar(undefined)
        setEdit(false)
    }
    async function editMenu(menu) {
        modal.show()
        setEdit(true)
        setIdMenu(menu.id_menu)
        setNamaMenu(menu.nama_menu)
        setDeskripsi(menu.deskripsi)
        setHarga(menu.harga)
        setJenis(menu.jenis)
        setGambar(undefined)
    }
    async function saveMenu(e) {
        try {
            e.preventDefault()
            modal.hide()
            if (edit) {
                let form = new FormData()
                form.append("nama_menu", nama_menu)
                form.append("deskripsi", deskripsi)
                form.append("harga", harga)
                form.append("jenis", jenis)

                if (gambar != undefined) {
                    form.append("gambar", gambar)
                }
                let url = `${baseURL}/menu/${id_menu}`
                let result = await axios.put(url, form, header)
                if (result.data.status == true) {
                    getMenu()
                }
                window.alert(result.data.message)
            } else {
                let form = new FormData()
                form.append("nama_menu", nama_menu)
                form.append("deskripsi", deskripsi)
                form.append("harga", harga)
                form.append("jenis", jenis)
                form.append("gambar", gambar)

                let url = `${baseURL}/menu`
                let result = await axios.post(url, form, header)
                if (result.data.status == true) {
                    getMenu()
                }
                window.alert(result.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function deleteMenu(menu) {
        try {
            if (window.confirm(`Apakah Anda yakin ingin menghapus ${menu.nama_menu}?`)) {
                let url = `${baseURL}/menu/${menu.id_menu}`
                axios.delete(url, header)
                    .then(result => {
                        if (result.data.status == true) {
                            window.alert(result.data.message)
                        }
                        getMenu()
                    })
                    .catch(error => {
                        console.log(error);
                    }
                    )
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getMenu()
        setModal(new Modal(`#modalMenu`))
    }, [])


    return (
        <div className='w-100 container-fluid'>
            <input type='text' className='form-control my-2' value={keyword} onChange={e => setKeyword(e.target.value)} onKeyUp={e => searchingMenu(e)} placeholder='Pencarian Menu' />
            <button className='btn btn-success mt-2 mb-3' onClick={() => addMenu()}>
                Tambah Menu
            </button> 
            <div className='row'>
                {menus.map(menu => (
                    <div key={`menu${menu.id_menu}`} className="col-md-6 col-lg-4">
                        <MenuItem
                            img={`${baseURL}/menu-image/${menu.gambar}`}
                            nama_menu={menu.nama_menu}
                            deskripsi={menu.deskripsi}
                            harga={menu.harga}
                            jenis={menu.jenis}
                            onEdit={() => editMenu(menu)}
                            onDelete={() => deleteMenu(menu)}
                        />
                    </div>
                ))}
            </div>
            <div className='modal fade' id='modalMenu'>
                <div className='modal-dialog modal-md'>
                    <div className='modal-content'>
                        <form onSubmit={e => saveMenu(e)}>
                            <div className='modal-header bg-success'>
                                <h4>Form Menu</h4>
                            </div>
                            <div className='modal-body'>
                                <small>Nama Menu</small>
                                <input type='text' className='form-control mb-2' value={nama_menu} onChange={e => setNamaMenu(e.target.value)} required={true} />
                                <small>Jenis Menu</small>
                                <select className='form-control mb-2' value={jenis} onChange={e => setJenis(e.target.value)} required={true}>
                                    <option value="">-- Pilih Jenis Menu</option>
                                    <option value="makanan">Makanan</option>
                                    <option value="minuman">Minuman</option>
                                </select>
                                <small>Deskripsi</small>
                                <input type='text' className='form-control mb-2' value={deskripsi} onChange={e => setDeskripsi(e.target.value)} required={true} />
                                <small>Harga</small>
                                <input type='number' className='form-control mb-2' value={harga} onChange={e => setHarga(e.target.value)} required={true} />
                                <small>Gambar</small>
                                <input type='file' accept='image/*' className='form-control mb-2' onChange={e => setGambar(e.target.files[0])} />
                                <button type="submit" className="btn btn-info w-100">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
