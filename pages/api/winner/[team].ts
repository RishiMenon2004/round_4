import fs from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'

export default function win_team(req: NextApiRequest, res: NextApiResponse) {
	let { team } = req.query
	let winnersData = JSON.parse(fs.readFileSync('./data/winners.json', 'utf-8'))

	if (!winnersData["winners"].includes(team)) {
		winnersData["winners"].push(team)
		fs.writeFileSync('./data/winners.json', JSON.stringify(winnersData))
		res.status(200).end(`${team} won`)
	} else {
		res.status(400).end(`${team} already exists`)
	}
}