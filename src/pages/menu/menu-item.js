import React from 'react'

export default function MenuItem(props) {
    return (
        <div className='w-100 mb-2 border rounded-2'>
            <img src={props.img} alt="image-menu" className='w-100 p-3 img-fluid rounded-2' />
            <div className='w-100 mt-2 p-2'>
                <h5 className='mb-1'>
                    {props.nama_menu}
                </h5>
                <h6 className='fw-normal mb-3'>
                    {props.jenis}
                </h6>
                <small>
                    {props.deskripsi}
                </small>
                <h6 className='mt-3'>
                    Rp {props.harga}
                </h6>
            </div>
            <div className='w-100 p-2'>
                <button className='btn btn-sm btn-warning' onClick={() => props.onEdit()}>
                    Edit
                </button>
                <button className='btn btn-sm btn-danger mx-1' onClick={() => props.onDelete()}>
                    Delete
                </button>
            </div>
        </div>
    )
}
