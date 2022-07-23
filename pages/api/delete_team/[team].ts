import fs from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'

export default function delete_team(req: NextApiRequest, res: NextApiResponse) {
	let { team } = req.query
	let pageLockData = JSON.parse(fs.readFileSync('./data/locks.json', 'utf-8'))

	if (pageLockData[`${team}`] !== undefined) {
		delete pageLockData[`${team}`]
		fs.writeFileSync('./data/locks.json', JSON.stringify(pageLockData))
		res.status(200).end(`${team} deleted`)
	} else {
		res.status(400).end(`${team} doesn't exist`)
	}
}