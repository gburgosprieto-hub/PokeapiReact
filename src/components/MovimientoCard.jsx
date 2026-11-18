import { formatearNombre, nombreTraducido, traducirTipo } from '../services/pokeapi.js'
import './pokemon.css'

export default function MovimientoCard({ movimiento, seleccionado, onSelect }) {
  const descripcion = movimiento.flavor_text_entries?.find(item => item.language.name === 'es')?.flavor_text?.replace(/[\n\f]/g, ' ') || 'Sin descripción en español.'
  return <button type="button" className={'movimiento-card ' + (seleccionado ? 'seleccionado' : '')} onClick={() => onSelect(movimiento)}>
    <h3>{nombreTraducido(movimiento.names, movimiento.name)}</h3>
    <p><b>Tipo:</b> {traducirTipo(movimiento.type.name)}</p>
    <p><b>Potencia:</b> {movimiento.power ?? '-'}</p>
    <p><b>Precisión:</b> {movimiento.accuracy ?? '-'}</p>
    <p><b>PP:</b> {movimiento.pp ?? '-'}</p>
    <p>{descripcion}</p>
  </button>
}
