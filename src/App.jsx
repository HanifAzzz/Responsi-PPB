import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const initialAssets = [
  { id: 1, name: 'Laptop Lenovo ThinkPad', category: 'Peralatan IT', location: 'Divisi Sistem Informasi', condition: 'Baik', year: '2024', value: 12500000 },
  { id: 2, name: 'Printer Epson L3210', category: 'Peralatan Kantor', location: 'Ruang Administrasi', condition: 'Baik', year: '2023', value: 2800000 },
  { id: 3, name: 'Meja Kerja Staff', category: 'Inventaris', location: 'Ruang Kerja', condition: 'Perlu Perbaikan', year: '2022', value: 1500000 },
]

const money = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value) || 0)

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [assets, setAssets] = useState(() => {
    try { return JSON.parse(localStorage.getItem('assettrack-assets')) || initialAssets }
    catch { return initialAssets }
  })
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [online, setOnline] = useState(navigator.onLine)
  const [apiMessage, setApiMessage] = useState('')

  useEffect(() => {
    localStorage.setItem('assettrack-assets', JSON.stringify(assets))
  }, [assets])

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    const onInstall = (event) => { event.preventDefault(); setInstallPrompt(event) }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    window.addEventListener('beforeinstallprompt', onInstall)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('beforeinstallprompt', onInstall)
    }
  }, [])

  const filtered = useMemo(() => assets.filter((item) =>
    `${item.name} ${item.category} ${item.location}`.toLowerCase().includes(query.toLowerCase())
  ), [assets, query])

  const totalValue = assets.reduce((sum, item) => sum + Number(item.value || 0), 0)

  function saveAsset(data) {
    if (editing) setAssets((current) => current.map((item) => item.id === editing.id ? { ...data, id: editing.id } : item))
    else setAssets((current) => [{ ...data, id: Date.now() }, ...current])
    setModal(false)
    setEditing(null)
  }

  function openEdit(asset) { setEditing(asset); setModal(true) }
  function removeAsset(id) {
    if (window.confirm('Yakin ingin menghapus data aset ini?')) setAssets((current) => current.filter((item) => item.id !== id))
  }

  async function installApp() {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  async function checkApi() {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1', { timeout: 5000 })
      setApiMessage(`Koneksi API berhasil (contoh data: ${response.data.title}).`)
    } catch {
      setApiMessage('API tidak dapat diakses. Data aset lokal tetap bisa digunakan.')
    }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">A</div><div><b>AssetTrack</b><small>ASSET MANAGEMENT</small></div></div>
      <div className="nav-label">MENU UTAMA</div>
      <nav>
        <button className={page === 'dashboard' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('dashboard')}><span>▦</span> Dashboard</button>
        <button className={page === 'assets' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('assets')}><span>▤</span> Data Aset</button>
        <button className={page === 'profile' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('profile')}><span>◉</span> Profil</button>
      </nav>
      <div className="sidebar-bottom"><div className="mini-status"><i className={online ? 'dot green' : 'dot red'} />{online ? 'Terhubung ke internet' : 'Mode offline'}</div><small>AssetTrack PWA v1.0</small></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div><div className="eyebrow">SISTEM INFORMASI MANAJEMEN</div><h1>{page === 'dashboard' ? 'Dashboard' : page === 'assets' ? 'Data Aset' : 'Profil Mahasiswa'}</h1></div>
        <div className="top-actions">
          <span className={online ? 'status online' : 'status offline'}><i />{online ? 'Online' : 'Offline'}</span>
          {installPrompt && <button className="btn btn-dark" onClick={installApp}>↓ Install App</button>}
          <div className="avatar">H</div>
        </div>
      </header>

      {page === 'dashboard' && <section className="content">
        <div className="welcome"><div><span className="welcome-kicker">SELAMAT DATANG</span><h2>Kelola aset dengan lebih mudah.</h2><p>Pantau inventaris dan informasi aset dalam satu tempat.</p></div><div className="welcome-art">▥</div></div>
        <div className="stats-grid">
          <Stat label="Total Aset" value={assets.length} note="Seluruh aset terdaftar" icon="▤" />
          <Stat label="Total Nilai Aset" value={money(totalValue)} note="Akumulasi nilai perolehan" icon="◈" />
          <Stat label="Kondisi Baik" value={assets.filter(a => a.condition === 'Baik').length} note="Aset dalam kondisi baik" icon="✓" />
        </div>
        <div className="section-heading"><div><h3>Aset Terbaru</h3><p>Data aset yang terakhir ditambahkan</p></div><button className="text-btn" onClick={() => setPage('assets')}>Lihat semua →</button></div>
        <AssetTable assets={assets.slice(0, 4)} onEdit={openEdit} onDelete={removeAsset} compact />
        <div className="api-card"><div><b>Integrasi API</b><p>Cek contoh komunikasi API menggunakan Axios.</p>{apiMessage && <small>{apiMessage}</small>}</div><button className="btn btn-outline" onClick={checkApi}>Uji koneksi API</button></div>
      </section>}

      {page === 'assets' && <section className="content">
        <div className="page-intro"><div><h2>Daftar Inventaris</h2><p>Tambah, ubah, cari, dan hapus data aset perusahaan.</p></div><button className="btn btn-dark" onClick={() => { setEditing(null); setModal(true) }}>＋ Tambah Aset</button></div>
        <div className="toolbar"><div className="search-box"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari nama, kategori, atau lokasi aset..." /></div><span className="muted">{filtered.length} data ditemukan</span></div>
        <AssetTable assets={filtered} onEdit={openEdit} onDelete={removeAsset} />
        <p className="offline-note">ⓘ Data tersimpan di perangkat ini dan tetap dapat dikelola saat offline.</p>
      </section>}

      {page === 'profile' && <section className="content profile-content">
        <div className="profile-card"><div className="profile-cover"></div><div className="profile-avatar">H</div><div className="profile-info"><span className="tag">MAHASISWA</span><h2>Hanif Arifandi Zulfikar</h2><p>Teknik Komputer · Universitas Diponegoro</p></div>
          <div className="profile-details"><Info label="Nama Lengkap" value="Hanif Arifandi Zulfikar" /><Info label="Nomor Induk Mahasiswa" value="21120124140154" /><Info label="Program Studi" value="Teknik Komputer" /><Info label="Kelompok" value="33" /></div>
        </div>
        <div className="about-card"><h3>Tentang Aplikasi</h3><p><b>AssetTrack</b> merupakan aplikasi Progressive Web App untuk membantu pencatatan dan pengelolaan data aset tetap. Aplikasi ini dibuat sebagai proyek akhir praktikum Pemrograman Perangkat Bergerak.</p><div className="tech-tags"><span>React JS</span><span>Vite</span><span>Axios</span><span>LocalStorage</span><span>Service Worker</span></div></div>
      </section>}
      <footer>© 2026 AssetTrack · Progressive Web App</footer>
    </main>
    {modal && <AssetModal asset={editing} onClose={() => { setModal(false); setEditing(null) }} onSave={saveAsset} />}
  </div>
}

function Stat({ label, value, note, icon }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><strong>{value}</strong><small>{note}</small></div>
}
function Info({ label, value }) { return <div className="info-item"><span>{label}</span><b>{value}</b></div> }

function AssetTable({ assets, onEdit, onDelete, compact = false }) {
  if (!assets.length) return <div className="empty-state"><div>▤</div><b>Belum ada data aset</b><p>Tambahkan data aset untuk mulai mengelola inventaris.</p></div>
  return <div className="table-wrap"><table><thead><tr><th>Nama Aset</th><th>Kategori</th><th>Lokasi</th><th>Kondisi</th><th>Nilai Perolehan</th>{!compact && <th>Aksi</th>}</tr></thead><tbody>
    {assets.map(asset => <tr key={asset.id}><td><b>{asset.name}</b><small className="sub-cell">Tahun {asset.year}</small></td><td>{asset.category}</td><td>{asset.location}</td><td><span className={asset.condition === 'Baik' ? 'condition good' : 'condition warn'}>{asset.condition}</span></td><td>{money(asset.value)}</td>{!compact && <td><div className="actions"><button title="Edit" onClick={() => onEdit(asset)}>✎</button><button title="Hapus" className="delete" onClick={() => onDelete(asset.id)}>⌫</button></div></td>}</tr>)}
  </tbody></table></div>
}

function AssetModal({ asset, onClose, onSave }) {
  const [form, setForm] = useState(asset || { name: '', category: 'Peralatan IT', location: '', condition: 'Baik', year: new Date().getFullYear().toString(), value: '' })
  const [error, setError] = useState('')
  function update(key, value) { setForm(current => ({ ...current, [key]: value })) }
  function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.location.trim() || !form.value || Number(form.value) < 0) {
      setError('Nama, lokasi, dan nilai aset wajib diisi dengan benar.')
      return
    }
    onSave({ ...form, name: form.name.trim(), location: form.location.trim(), value: Number(form.value) })
  }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><form className="modal" onSubmit={submit}>
    <div className="modal-head"><div><span className="eyebrow">FORMULIR INVENTARIS</span><h2>{asset ? 'Edit Data Aset' : 'Tambah Aset Baru'}</h2></div><button type="button" className="close-btn" onClick={onClose}>×</button></div>
    <label>Nama Aset<input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Contoh: Laptop Lenovo" /></label>
    <div className="form-row"><label>Kategori<select value={form.category} onChange={e => update('category', e.target.value)}><option>Peralatan IT</option><option>Peralatan Kantor</option><option>Inventaris</option><option>Kendaraan</option><option>Bangunan</option><option>Mesin</option></select></label><label>Tahun Perolehan<input type="number" min="1990" max="2100" value={form.year} onChange={e => update('year', e.target.value)} /></label></div>
    <label>Lokasi Aset<input value={form.location} onChange={e => update('location', e.target.value)} placeholder="Contoh: Ruang Administrasi" /></label>
    <div className="form-row"><label>Kondisi<select value={form.condition} onChange={e => update('condition', e.target.value)}><option>Baik</option><option>Perlu Perbaikan</option></select></label><label>Nilai Perolehan (Rp)<input type="number" min="0" value={form.value} onChange={e => update('value', e.target.value)} placeholder="Contoh: 5000000" /></label></div>
    {error && <p className="form-error">{error}</p>}
    <div className="modal-actions"><button type="button" className="btn btn-outline" onClick={onClose}>Batal</button><button type="submit" className="btn btn-dark">Simpan Data</button></div>
  </form></div>
}