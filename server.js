import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

// App Configuration
app.use(express.static('public'))
app.use(cookieParser())

app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.txt || '',
        minSeverity: req.minSeverity || 0,
        labels: req.labels || [],
    }
    const sortBy = {
        sortField: req.sortField || '',
        sortDir: req.sortDir || 1,
    }
	bugService.query({ ...filterBy, ...sortBy })
		.then(bugs => {
			res.send(bugs)
		})
		.catch(err => {
			loggerService.error('Cannot get bugs', err)
			res.status(400).send('Cannot get bugs')
		})
})

app.post('/api/bug', (req, res) => {
	const { title, description, severity, _id } = req.query
	const bug = {
		_id,
		title,
		description,
		severity: +severity,
	}

	bugService.save(bug)
		.then(savedBug => {
			res.send(savedBug)
		})
		.catch(err => {
			loggerService.error('Cannot save bug', err)
			res.status(400).send('Cannot save bug')
		})
})

app.put('/api/bug/:bugId', (req, res) => {
	const { title, description, severity, _id } = req.query
	const bug = {
		_id,
		title,
		description,
		severity: +severity,
	}

	bugService.save(bug)
		.then(savedBug => {
			res.send(savedBug)
		})
		.catch(err => {
			loggerService.error('Cannot save bug', err)
			res.status(400).send('Cannot save bug')
		})
})

app.get('/api/bug/:bugId', (req, res) => {
	const { bugId } = req.params
	const { visitCountMap = [] } = req.cookies

	if (visitCountMap.length >= 3) return res.status(401).send('Wait for a bit')
	if (!visitCountMap.includes(bugId)) visitCountMap.push(bugId)

	res.cookie('visitCountMap', visitCountMap, { maxAge: 1000 * 10 })
	bugService.getById(bugId)
		.then(bug => res.send(bug))
		.catch(err => {
			loggerService.error('Cannot get bug', err)
			res.status(400).send('Cannot get bug')
		})
})

app.delete('/api/bug/:bugId', (req, res) => {
	const { bugId } = req.params
	bugService.remove(bugId)
		.then(() => {
			loggerService.info(`Bug ${bugId} removed`)
			res.send('Removed!')
		})
		.catch(err => {
			loggerService.error('Cannot get bug', err)
			res.status(400).send('Cannot get bug')
		})
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
