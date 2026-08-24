import { useEffect, useState } from 'react'
import { ArrowUpRight, AtSign, ChevronDown, ChevronRight, Disc3, Menu, Pause, Play, Send, Video, X } from 'lucide-react'
import { tracks } from './data/tracks'
import { services } from './data/services'
import { createDonationPreference } from './services/mercadoPago'
import './App.css'

const socials = [
  { label: 'Instagram', handle: '@plasonthebeat', href: 'https://www.instagram.com/plasonthebeat/', icon: AtSign },
  { label: 'YouTube', handle: '@PLASONTHE', href: 'https://www.youtube.com/@PLASONTHE', icon: Video },
  { label: 'TikTok', handle: '@checkthisplas', href: 'https://www.tiktok.com/@checkthisplas', icon: Disc3 },
]

function Logo({ compact = false }) {
  return <a className={`logo ${compact ? 'logo--compact' : ''}`} href="#inicio" aria-label="PLAS, inicio"><span>PL</span><i>Δ</i><span>S</span></a>
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [['Sobre mí', 'sobre-mi'], ['Música', 'musica'], ['Servicios', 'servicios'], ['Contrataciones', 'contrataciones'], ['Apoyar', 'apoyar'], ['Contacto', 'contacto']]
  return <header className="navbar"><div className="nav-inner"><Logo compact /><nav className={open ? 'nav-links is-open' : 'nav-links'}>{links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</nav><a className="nav-cta" href="#contacto">Hablemos <ArrowUpRight size={15} /></a><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Abrir menú">{open ? <X /> : <Menu />}</button></div></header>
}

function Waveform() {
  return <div className="waveform" aria-label="Visualización de audio" role="img">{Array.from({ length: 52 }, (_, index) => <i key={index} style={{ height: `${22 + ((index * 19) % 62)}%`, animationDelay: `${index * 0.035}s` }} />)}</div>
}

function MusicPlayer({ track, activeTrack, onPlay }) {
  const isPlaying = activeTrack === track.id
  return <article className={`track-card ${isPlaying ? 'is-playing' : ''}`}>
    <div className="track-cover"><img src={track.cover} alt={`Portada de ${track.title}`} /><span className="track-index">0{track.id}</span><button className="play-button" onClick={() => onPlay(track.id)} aria-label={`${isPlaying ? 'Pausar' : 'Reproducir'} ${track.title}`}>{isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button></div>
    <div className="track-info"><div className="track-heading"><div><p className="eyebrow">{track.artist}</p><h3>{track.title}</h3></div><span>{track.year}</span></div><div className="track-meta"><span>{track.genre}</span><span>{track.duration}</span></div><div className="progress-line"><span style={{ width: isPlaying ? '38%' : '12%' }} /></div><button className="text-link" onClick={() => document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' })}>Ver más info <ArrowUpRight size={14} /></button></div>
  </article>
}

function App() {
  const [activeTrack, setActiveTrack] = useState(null)
  const [selectedAmount, setSelectedAmount] = useState(5000)
  const [customAmount, setCustomAmount] = useState('')
  const [donationState, setDonationState] = useState('idle')

  useEffect(() => {
    if (!activeTrack) return undefined
    const track = tracks.find((item) => item.id === activeTrack)
    if (!track?.audio) return undefined
    const audio = new Audio(track.audio)
    audio.play().catch(() => setActiveTrack(null))
    return () => { audio.pause(); audio.src = '' }
  }, [activeTrack])

  async function handleDonation() {
    const amount = customAmount ? Number(customAmount) : selectedAmount
    if (!Number.isInteger(amount) || amount < 100 || amount > 1000000) {
      setDonationState('invalid')
      return
    }
    setDonationState('loading')
    try {
      const preference = await createDonationPreference(amount)
      window.location.href = preference.init_point
    } catch { setDonationState('error') }
  }

  return <div className="site-shell"><Navbar /><main>
    <section className="hero section-pad" id="inicio"><div className="hero-copy"><p className="kicker reveal">PRODUCTOR MUSICAL · BEATMAKER</p><h1 className="reveal reveal-delay-1">SONIDO QUE<br /><em>DEJA MARCA.</em></h1><p className="hero-description reveal reveal-delay-2">Creo beats y producciones con carácter para artistas que quieren llevar su música al próximo nivel.</p><div className="hero-actions reveal reveal-delay-3"><a className="button button--primary" href="#musica">Escuchar mi música <Play size={16} fill="currentColor" /></a><a className="button button--ghost" href="#contacto">Contrataciones <ArrowUpRight size={16} /></a></div></div><div className="hero-art"><div className="hero-orbit" /><div className="hero-disc"><span>PLΔS</span><small>EST. / NOW</small></div><div className="hero-tag hero-tag--top">01 / STUDIO<br /><strong>MODE: ON</strong></div><div className="hero-tag hero-tag--bottom">SAN RAFAEL MENDOZA<br /><strong>→ INTERNACIONAL</strong></div><Waveform /></div><div className="scroll-hint">SCROLL TO EXPLORE <ChevronDown size={16} /></div></section>
    <section className="statement"><div className="section-label">01 / SOBRE MÍ</div><div className="statement-content"><h2>De la idea al sonido.<br /><span>Del sonido al mundo.</span></h2><p>PLAS es un productor musical y beatmaker con una visión clara: ser el mejor del país y representar nuestro sonido en cualquier parte del mundo. Cada producción empieza con una intención y termina con una identidad.</p><a className="text-link" href="#contacto">Conocé el proceso <ArrowUpRight size={14} /></a></div></section>
    <section className="about section-pad" id="sobre-mi"><div className="about-image"><div className="image-placeholder"><img src="/PLAS.png" alt="PLAS, productor musical y beatmaker" /></div><span className="image-caption">PLAS / PRODUCER</span></div><div className="about-details"><p className="kicker">SOBRE PLAS</p><h2>Ambición en cada<br /><em>frecuencia.</em></h2><p className="body-copy">No se trata solo de hacer beats. Se trata de construir un universo alrededor de cada canción, encontrar el color correcto y dejar una huella que se reconozca.</p><div className="detail-grid"><div><strong>+[X]</strong><span>Años de experiencia</span></div><div><strong>TRAP / BOOMBAP </strong><span>Géneros principales</span></div><div><strong>[EQUIPO]</strong><span>Setup de producción</span></div><div><strong>24/7</strong><span>Modo creativo</span></div></div></div></section>
    <section className="music section-pad" id="musica"><div className="section-heading"><div><p className="kicker">02 / PRODUCCIONES</p><h2>Escuchá el<br /><em>universo PLAS.</em></h2></div><p>Una selección de trabajos y demos para entrar en el mood.</p></div><div className="tracks-grid">{tracks.map((track) => <MusicPlayer key={track.id} track={track} activeTrack={activeTrack} onPlay={(id) => { const selectedTrack = tracks.find((item) => item.id === id); if (!selectedTrack?.audio) return; setActiveTrack(activeTrack === id ? null : id) }} />)}</div></section>
    <section className="services section-pad" id="servicios"><div className="section-heading"><div><p className="kicker">03 / LO QUE HAGO</p><h2>Tu visión.<br /><em>Mi sonido.</em></h2></div><p>Desde el primer beat hasta el último detalle de la mezcla. Todo lo que tu música necesita para sonar a vos.</p></div><div className="services-list">{services.map(({ icon: Icon, number, title, description }) => <a className="service-row" href="#contacto" key={number}><span className="service-number">{number}</span><Icon className="service-icon" size={23} /><div><h3>{title}</h3><p>{description}</p></div><ChevronRight className="service-arrow" size={20} /></a>)}</div></section>
    <section className="booking section-pad" id="contrataciones"><div className="booking-intro"><p className="kicker">04 / TRABAJEMOS</p><h2>¿Tenés un<br /><em>proyecto?</em></h2><p>Contame qué estás imaginando. Hablemos de tu próximo lanzamiento, beat o colaboración.</p><a className="button button--ghost" href="plasonthe@gmail.com" target="_blank" rel="noreferrer"> Gmail <ArrowUpRight size={16} /></a></div><form className="booking-form" onSubmit={(event) => event.preventDefault()}><label>Tu nombre<input required placeholder="Nombre y apellido" /></label><label>Email<input type="email" required placeholder="tu@email.com" /></label><label>WhatsApp<input placeholder="+54 9 ..." /></label><label>Servicio<select defaultValue=""><option value="" disabled>¿En qué te ayudo?</option><option>Producción musical</option><option>Beat exclusivo</option><option>Mezcla & mastering</option><option>Otro proyecto</option></select></label><label className="form-wide">Mensaje<textarea rows="4" placeholder="Contame un poco sobre tu idea..." /></label><button className="button button--primary form-wide" type="submit">Enviar consulta <Send size={16} /></button></form></section>
    <section className="donation section-pad" id="apoyar"><div className="donation-mark">+</div><div><p className="kicker">05 / APOYO</p><h2>Apoyá mi <em>música.</em></h2><p>Si algo de lo que hago te mueve, podés ayudarme a seguir creando, mejorando y llevando este sonido más lejos.</p></div><div className="donation-actions"><div className="amounts">{[2000, 5000, 10000, 20000].map((amount) => <button key={amount} className={!customAmount && selectedAmount === amount ? 'selected' : ''} onClick={() => { setCustomAmount(''); setSelectedAmount(amount); setDonationState('idle') }}>${amount.toLocaleString('es-AR')}</button>)}<button className={customAmount || donationState === 'custom' ? 'selected other' : 'other'} onClick={() => setDonationState('custom')}>OTRO MONTO</button></div>{donationState === 'custom' && <label className="custom-amount">Monto en ARS<input type="number" min="100" max="1000000" step="1" value={customAmount} onChange={(event) => { setCustomAmount(event.target.value); setDonationState('custom') }} placeholder="Ej: 3500" /></label>}<button className="button button--primary" onClick={handleDonation} disabled={donationState === 'loading'}>{donationState === 'loading' ? 'Conectando...' : 'Donar con Mercado Pago'} <ArrowUpRight size={16} /></button>{donationState === 'error' && <small className="form-error">No se pudo iniciar la donación. Revisá la configuración del servidor.</small>}{donationState === 'invalid' && <small className="form-error">Ingresá un monto entero entre $100 y $1.000.000.</small>}</div></section>
    <section className="socials section-pad" id="contacto"><div className="socials-heading"><p className="kicker">06 / ENCONTRAME</p><h2>Seguimos la<br /><em>conversación.</em></h2><p>Para novedades, lanzamientos y material detrás de escena.</p></div><div className="socials-list">{socials.map(({ label, handle, href, icon: Icon }) => <a href={href} target={href === '#' ? undefined : '_blank'} rel="noreferrer" key={label}><Icon size={20} /><span><strong>{label}</strong><small>{handle}</small></span><ArrowUpRight size={17} /></a>)}</div></section>
  </main><footer><Logo compact /><span>© 2024 PLAS. Hecho con intención.</span><a href="#inicio">Volver arriba ↑</a></footer></div>
}

export default App
