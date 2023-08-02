import React from 'react'
import Login from './pages/login'
import Middleware from './pages/middleware'
import Home from './pages/home'
import Transaksi from './pages/transaksi/'
import User from './pages/user'
import Meja from './pages/meja'
import Menu from './pages/menu'
import Sidebar from './pages/sidebar'
import { Route, Routes, BrowserRouter } from 'react-router-dom'

export default function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Middleware roles={['admin', 'kasir', 'manajer']}><Sidebar title="Home"><Home /></Sidebar></Middleware>} />
          <Route path='/menu' element={<Middleware roles={['admin']}><Sidebar title="Daftar Menu"><Menu /></Sidebar></Middleware>} />
          <Route path='/transaksi' element={<Middleware roles={['kasir','manajer']}><Sidebar title="Daftar Transaksi"><Transaksi /></Sidebar></Middleware>} />
          <Route path='/table' element={<Middleware roles={['admin']}><Sidebar title="Meja"><Meja /></Sidebar></Middleware>} />
          <Route path='/user' element={<Middleware roles={['admin', 'kasir']}><Sidebar title="User"><User /></Sidebar></Middleware>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
