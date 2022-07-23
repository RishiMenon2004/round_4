import fs from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'

export default function create_team(req: NextApiRequest, res: NextApiResponse) {
	let { team } = req.query
	let pageLockData = JSON.parse(fs.readFileSync('./data/locks.json', 'utf-8'))

	if (pageLockData[`${team}`] === undefined) {
		pageLockData[`${team}`] = {
			task_one: true,
			task_two: true,
			task_three: true,
		}
		fs.writeFileSync('./data/locks.json', JSON.stringify(pageLockData))
		res.status(200).end(`${team} created`)
	} else {
		res.status(400).end(`${team} already exists`)
	}
}