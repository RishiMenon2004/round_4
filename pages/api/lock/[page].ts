import fs from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'

export default function lock(req: NextApiRequest, res: NextApiResponse) {
	let { page } = req.query
	let pageLockData = JSON.parse(fs.readFileSync('./data/locks.json', 'utf-8'))

	if (pageLockData[`${page}`] !== undefined) {
		pageLockData[`${page}`] = true
		fs.writeFileSync('./data/locks.json', JSON.stringify(pageLockData))
		res.status(200).end(`${page} is locked`)
	} else {
		res.status(404).end(`${page} not found`)
	}
}