import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

export type TodoRow = {
	created_at: Date
	text: string
	done: boolean
}

export type TodoRows = Record<string, TodoRow>

type Data = {
	todos: Record<string, TodoRows>
}

// Use JSON file for storage
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')
const adapter = new JSONFile<Data>(file)
export const db = new Low(adapter)
