import { read, write, deleteId } from './_api'
import type { RequestHandler } from './__types'

export const GET: RequestHandler = async ({ locals }) => {
	return {
		body: {
			todos: await read(locals.userid)
		}
	}
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const form = await request.formData()

	const todos = await read(locals.userid)

	let id
	do {
		id = crypto.randomUUID()
	} while (id in todos)

	await write(locals.userid, {
		id,
		userId: locals.userid,
		text: form.get('text')?.toString() || '',
		done: false,
		created_at: new Date()
	})

	return {}
}

// If the user has JavaScript disabled, the URL will change to
// include the method override unless we redirect back to /todos
const redirect = {
	status: 303,
	headers: {
		location: '/todos'
	}
}

export const PATCH: RequestHandler = async ({ request, locals }) => {
	const form = await request.formData()

	const id = form.get('id')?.toString() || ''
	const todos = await read(locals.userid, id)
	const todo = todos[0]

	if (!todo) {
		throw new Error(`Can't find todo ${id} for user ${locals.userid}`)
	}

	todo.text = form.get('text')?.toString() || todo.text
	todo.done = !!form.get('done')

	await write(locals.userid, todo)

	return redirect
}

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const form = await request.formData()

	if (!form.get('id')) {
		throw new Error('Delete id is null')
	}

	deleteId(locals.userid, form.get('id')?.toString() || '')

	return redirect
}
