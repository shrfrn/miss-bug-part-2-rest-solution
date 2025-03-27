import fs from 'fs'

import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save
}

const bugs = utilService.readJsonFile('data/bug.json')

function query(filterBy) {
    const bugsToReturn = [ ...bugs ]

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToReturn = 
            bugsToReturn.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        bugsToReturn = 
            bugsToReturn.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.sortField === 'severity' || filterBy.sortField === 'createdAt') {
        const { sortField } = filterBy
        
        bugsToReturn.sort((bug1, bug2) => 
            (bug1[sortField] - bug2[sortField]) * filterBy.sortDir)
    } else if (filterBy.sortField === 'title') {
        bugsToReturn.sort((bug1, bug2) => 
            (bug1.txt.localeCompare(bug2.txt)) * filterBy.sortDir)
    } 

    return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    // pdfService.buildAnimalsPDF(bugs) //pdf bonus
    if (!bug) return Promise.reject('Bug not found!')
    return Promise.resolve(bug)
}

function remove(bugId) {
    // bugs = bugs.filter(bug => bug._id !== bugId)
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    console.log('bug: ', bug)
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[idx] = { ...bugs[idx], ...bug }
    } else {
        bug._id = utilService.makeId()
        bug.createdAt = Date.now()
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to bugs file', err)
                return reject(err);
            }
            console.log('The file was saved!');
            resolve()
        });
    })
}

