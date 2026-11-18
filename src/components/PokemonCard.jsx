import { formatearNombre, imagenPokemon, traducirTipo } from '../services/pokeapi.js'
import './pokemon.css'

export default function PokemonCard({ pokemon, onSelect, seleccionado }) {
  return <button type="button" onClick={() => onSelect(pokemon)} className={'pokemon-card ' + (seleccionado ? 'seleccionado' : '')}>
    <p>#{String(pokemon.id).padStart(3, '0')}</p>
    <img src={imagenPokemon(pokemon)} alt={pokemon.name} loading="lazy" />
    <h3>{formatearNombre(pokemon.name)}</h3>
    <p>Tipo: {pokemon.types.map(({ type }) => traducirTipo(type.name)).join(', ')}</p>
    <p>Ver detalles</p>
  </button>
}
