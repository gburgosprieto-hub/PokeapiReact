// Toda la información se consulta directamente a la API oficial.
const BASE = 'https://pokeapi.co/api/v2'

export async function obtenerDatos(url) {
  const respuesta = await fetch(url.startsWith('http') ? url : `${BASE}/${url}`)
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status}: no se han podido obtener los datos`)
  return respuesta.json()
}

export const obtenerListado = (pagina = 0, limite = 12) =>
  obtenerDatos(`pokemon?limit=${limite}&offset=${pagina * limite}`)
export const obtenerPokemon = (nombreOId) => obtenerDatos(`pokemon/${nombreOId}`)
export const obtenerMovimiento = (url) => obtenerDatos(url)
export const obtenerEspecie = (url) => obtenerDatos(url)

export function imagenPokemon(pokemon) {
  return pokemon.sprites?.other?.['official-artwork']?.front_default
    || pokemon.sprites?.other?.home?.front_default
    || pokemon.sprites?.front_default
    || ''
}

const nombresTipos = { normal:'normal', fire:'fuego', water:'agua', electric:'eléctrico', grass:'planta', ice:'hielo', fighting:'lucha', poison:'veneno', ground:'tierra', flying:'volador', psychic:'psíquico', bug:'bicho', rock:'roca', ghost:'fantasma', dragon:'dragón', dark:'siniestro', steel:'acero', fairy:'hada' }
export const traducirTipo = tipo => nombresTipos[tipo] || tipo
export const formatearNombre = nombre => nombre.replaceAll('-', ' ')
export function nombreTraducido(registros, alternativa) {
  return registros?.find(item => item.language.name === 'es')?.name || formatearNombre(alternativa)
}
