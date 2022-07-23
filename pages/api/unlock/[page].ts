import fs from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'

export default function lock(req: NextApiRequest, res: NextApiResponse) {
	let { page } = req.query
	let { teamName } = JSON.parse(req.body)

	let pageLockData = JSON.parse(fs.readFileSync('./data/locks.json', 'utf-8'))
	const teamNames = Object.keys(pageLockData)

	if (teamNames.includes(teamName)) {
		pageLockData[teamName][`${page}`] = false
		fs.writeFileSync('./data/locks.json', JSON.stringify(pageLockData))
		res.status(200).end(`${page} unlocked for ${teamName}`)
		return
	} else {
		res.status(400).end(`${teamName} does not exist`)
		return
	}
}