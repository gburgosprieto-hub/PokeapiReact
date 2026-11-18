import { formatearNombre, imagenPokemon, traducirTipo } from '../services/pokeapi.js'
import './pokemon.css'

export default function PokemonDetail({ pokemon, descripcion, onMoveSelect }) {
  return <article className="detalle-panel">
    <img className="detalle-imagen" src={imagenPokemon(pokemon)} alt={pokemon.name} />
    <div>
      <h3>#{pokemon.id} - {formatearNombre(pokemon.name)}</h3>
      <p><b>Tipo:</b> {pokemon.types.map(({ type }) => traducirTipo(type.name)).join(', ')}</p>
      <p>{descripcion || 'Descripción no disponible.'}</p>
      <p><b>Altura:</b> {pokemon.height / 10} m</p>
      <p><b>Peso:</b> {pokemon.weight / 10} kg</p>
      <p><b>Habilidades:</b> {pokemon.abilities.map(x => formatearNombre(x.ability.name)).join(', ')}</p>
      <h4>Estadísticas</h4>
      <ul>{pokemon.stats.map(({stat, base_stat}) => <li key={stat.name}>{formatearNombre(stat.name)}: {base_stat}</li>)}</ul>
      <h4>Movimientos</h4>
      <div className="enlaces-movimientos">
        {pokemon.moves.slice(0, 15).map(({move}) => <button type="button" key={move.name} onClick={() => onMoveSelect(move.url)}>{formatearNombre(move.name)}</button>)}
      </div>
    </div>
  </article>
}
