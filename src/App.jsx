import { useEffect, useState } from 'react'
import Layout from './layout/Layout.jsx'
import PokemonCard from './components/PokemonCard.jsx'
import PokemonDetail from './components/PokemonDetail.jsx'
import MovimientoCard from './components/MovimientoCard.jsx'
import { obtenerListado, obtenerPokemon, obtenerEspecie, obtenerMovimiento, imagenPokemon } from './services/pokeapi.js'
import './App.css'

const POR_PAGINA = 12

function App() {
  const [pagina, setPagina] = useState(0)
  const [pokemons, setPokemons] = useState([])
  const [total, setTotal] = useState(0)
  const [pokemonElegido, setPokemonElegido] = useState(null)
  const [descripcion, setDescripcion] = useState('')
  const [movimientos, setMovimientos] = useState([])
  const [movimientoElegido, setMovimientoElegido] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [cargandoMovimientos, setCargandoMovimientos] = useState(false)
  const [error, setError] = useState('')
  const [errorDetalle, setErrorDetalle] = useState('')
  const [errorMovimientos, setErrorMovimientos] = useState('')

  useEffect(() => {
    let activo = true
    async function cargar() {
      setCargando(true)
      setError('')
      try {
        const listado = await obtenerListado(pagina, POR_PAGINA)
        const detalles = await Promise.all(listado.results.map(p => obtenerPokemon(p.name)))
        if (activo) {
          setPokemons(detalles)
          setTotal(listado.count)
          setPokemonElegido(actual => actual || detalles[0] || null)
        }
      } catch (e) {
        if (activo) setError(e.message)
      } finally {
        if (activo) setCargando(false)
      }
    }
    cargar()
    return () => { activo = false }
  }, [pagina])

  useEffect(() => {
    if (!pokemonElegido) return
    let activo = true
    setCargandoDetalle(true)
    setCargandoMovimientos(true)
    setErrorDetalle('')
    setErrorMovimientos('')
    setDescripcion('')
    setMovimientos([])
    setMovimientoElegido(null)

    obtenerEspecie(pokemonElegido.species.url)
      .then(especie => {
        const entrada = especie.flavor_text_entries.find(x => x.language.name === 'es')
          || especie.flavor_text_entries.find(x => x.language.name === 'en')
        if (activo) setDescripcion(entrada?.flavor_text.replace(/[\n\f]/g, ' ') || '')
      })
      .catch(() => { if (activo) setErrorDetalle('No se ha podido cargar la descripción.') })
      .finally(() => { if (activo) setCargandoDetalle(false) })

    const disponibles = pokemonElegido.moves.slice(0, 6)
    Promise.all(disponibles.map(x => obtenerMovimiento(x.move.url)))
      .then(datos => {
        if (activo) {
          setMovimientos(datos)
          setMovimientoElegido(datos[0] || null)
        }
      })
      .catch(() => { if (activo) setErrorMovimientos('No se han podido cargar los movimientos.') })
      .finally(() => { if (activo) setCargandoMovimientos(false) })

    return () => { activo = false }
  }, [pokemonElegido])

  async function seleccionarMovimiento(url) {
    document.getElementById('movimientos')?.scrollIntoView({ behavior: 'smooth' })
    const encontrado = movimientos.find(m => `https://pokeapi.co/api/v2/move/${m.id}/` === url)
    if (encontrado) { setMovimientoElegido(encontrado); return }
    setCargandoMovimientos(true)
    setErrorMovimientos('')
    try {
      const dato = await obtenerMovimiento(url)
      setMovimientos(actual => actual.some(x => x.id === dato.id) ? actual : [dato, ...actual])
      setMovimientoElegido(dato)
    } catch (e) { setErrorMovimientos(e.message) }
    finally { setCargandoMovimientos(false) }
  }

  return <Layout>
    <section className="intro contenedor" id="inicio">
      <h1>Mi Pokédex</h1>
      <p>Lista de Pokémon usando PokéAPI.</p>
    </section>

    <section className="seccion contenedor" id="listado"><div className="seccion-titulo"><div><h2>Lista de Pokémon</h2><p>Pulsa en un Pokémon para ver sus datos.</p></div><span className="contador-listado">{total.toLocaleString('es-ES')} Pokémon</span></div>
      {cargando && <p role="status">Cargando Pokémon de la API...</p>}
      {error && <p className="mensaje-error" role="alert">{error} <button onClick={() => setPagina(x => x === 0 ? 0 : 0)}>Volver al inicio</button></p>}
      {!cargando && !error && <><div className="pokemon-grid">{pokemons.map(pokemon => <PokemonCard key={pokemon.id} pokemon={pokemon} seleccionado={pokemon.id===pokemonElegido?.id} onSelect={setPokemonElegido}/>)}</div><div className="paginacion"><button disabled={pagina===0} onClick={() => setPagina(x=>x-1)}>Anterior</button><span>Página {pagina+1} de {Math.ceil(total/POR_PAGINA)}</span><button disabled={(pagina+1)*POR_PAGINA>=total} onClick={() => setPagina(x=>x+1)}>Siguiente</button></div></>}
    </section>

    <section className="seccion contenedor" id="detalle"><div className="seccion-titulo"><div><h2>Ficha extensa</h2><p>Datos del Pokémon seleccionado.</p></div>{pokemonElegido && <span className="chip">#{String(pokemonElegido.id).padStart(3,'0')}</span>}</div>
      {pokemonElegido ? <><PokemonDetail pokemon={pokemonElegido} descripcion={descripcion} onMoveSelect={seleccionarMovimiento}/>{cargandoDetalle && <p role="status">Cargando descripción...</p>}{errorDetalle && <p className="mensaje-error">{errorDetalle}</p>}</> : <p>Selecciona un Pokémon del listado.</p>}
    </section>

    <section className="seccion contenedor" id="movimientos"><div className="seccion-titulo"><div><h2>Ficha de movimientos</h2><p>Movimientos del Pokémon seleccionado.</p></div><span className="contador-listado">{movimientos.length} movimientos cargados</span></div>
      {cargandoMovimientos && <p role="status">Cargando movimientos...</p>}
      {errorMovimientos && <p className="mensaje-error" role="alert">{errorMovimientos}</p>}
      {movimientoElegido && <p className="movimiento-seleccionado">Seleccionado: <strong>{movimientoElegido.names.find(x=>x.language.name==='es')?.name || movimientoElegido.name}</strong> · Potencia: {movimientoElegido.power ?? '—'} · PP: {movimientoElegido.pp ?? '—'}</p>}
      <div className="movimientos-grid">{movimientos.map(movimiento => <MovimientoCard key={movimiento.id} movimiento={movimiento} seleccionado={movimientoElegido?.id===movimiento.id} onSelect={setMovimientoElegido}/>)}</div>
    </section>
  </Layout>
}

export default App
