import './layout.css'
export default function Header() {
  return <header className="header"><div className="contenedor header-interior">
    <strong>Pokédex</strong>
    <nav><a href="#inicio">Inicio</a><a href="#listado">Pokémon</a><a href="#detalle">Ficha</a><a href="#movimientos">Movimientos</a></nav>
  </div></header>
}
