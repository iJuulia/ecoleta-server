import { db } from './db'
import * as schema from './schema'

await db.insert(schema.itemsSchema).values([
  {
    title: 'Lâmpadas',
    image: 'lampadas.svg',
  },
  {
    title: 'Pilhas e baterias',
    image: 'baterias.svg',
  },
  {
    title: 'Papéis e Papelão',
    image: 'papeis-papelao.svg',
  },
  {
    title: 'Resíduos Eletrônicas',
    image: 'eletronicos.svg',
  },
  {
    title: 'Resíduos Orgânicos',
    image: 'organicos.svg',
  },
  {
    title: 'Óleo de Cozinha',
    image: 'oleo.svg',
  },
])

console.log('Seeding complete.')
