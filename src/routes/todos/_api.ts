/*
	This module is used by the /todos endpoint to
	make calls to api.svelte.dev, which stores todos
	for each user. The leading underscore indicates that this is
	a private module, _not_ an endpoint — visiting /todos/_api
	will net you a 404 response.

	(The data on the todo app will expire periodically; no
	guarantees are made. Don't use it to organise your life.)
*/

export type Todo = TodoRow & {
	id: string
	userId: string
}

import { db, type TodoRow, type TodoRows } from '$lib/db'

export async function read(userId: string, todoId?: string): Promise<Todo[]> {
	await db.read()
	db.data ||= {
		todos: {}
	}
	db.data.todos[userId] ||= {}

	const todos: TodoRows = todoId
		? { [todoId]: db.data.todos[userId][todoId] }
		: db.data.todos[userId]

	return Object.entries(todos).map(([id, todoRow]) => {
		return {
			...todoRow,
			id,
			userId
		}
	})
}

export async function write(userId: string, todo: Todo): Promise<Todo> {
	await db.read()
	db.data ||= {
		todos: {}
	}
	db.data.todos[userId] ||= {}

	db.data.todos[userId][todo.id] = {
		text: todo.text,
		done: todo.done,
		created_at: todo.created_at
	}

	await db.write()

	return todo
}

export async function deleteId(userId: string, todoId: string) {
	await db.read()
	db.data ||= {
		todos: {}
	}
	db.data.todos[userId] ||= {}

	const deleted = delete db.data.todos[userId][todoId]

	await db.write()

	return deleted
}
