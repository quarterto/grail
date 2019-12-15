import React from 'react'
import { Form } from '../client/control/form'
import { Input, Textarea, Select } from '../client/visual/form'

export default {
	title: 'Form',
}

export const input = () => (
	<Form>
		<Input name='test' />
	</Form>
)

export const textarea = () => (
	<Form>
		<Textarea name='test' />
	</Form>
)

export const select = () => (
	<Form>
		<Select name='test'>
			<option>Option 1</option>
			<option>Option 2</option>
			<option>Option 3</option>
		</Select>
	</Form>
)
