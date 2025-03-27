import { bugService } from "../services/bug.service.remote.js"
import { LabelChooser } from "./LabelChooser.jsx"

const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    console.log(filterBy)

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const labels = bugService.getLabels()

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'radio':
                value = target.value
                break
            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setFilterByToEdit(prevFilter => {
            console.log({ ...prevFilter, [field]: value })
            return ({ ...prevFilter, [field]: value })
        })
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, minSeverity } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <form onSubmit={onSubmitFilter}>
                <label className="tag" htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label className="tag" htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />
                
                <div className="sort-by">
                    <div className="sort-field">
                        <label className="tag" >
                            <span>Title</span>
                            <input
                                type="radio"
                                name="sortField"
                                value="title"
                                checked={filterByToEdit.sortField === 'title'}
                                onChange={handleChange}
                            />
                        </label>
                        <label className="tag" >
                            <span>Severity</span>
                            <input
                                type="radio"
                                name="sortField"
                                value="severity"
                                checked={filterByToEdit.sortField === 'severity'}            
                                onChange={handleChange}
                            />
                        </label>
                        <label className="tag" >
                            <span>Created At</span>
                            <input
                                type="radio"
                                name="sortField"
                                value="createdAt"
                                checked={filterByToEdit.sortField === 'createdAt'}                        
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="sort-dir">
                        <label className="tag" >
                            <span>Asce</span>
                            <input
                                type="radio"
                                name="sortDir"
                                value="1"
                                checked={filterByToEdit.sortDir === "1"}                        
                                onChange={handleChange}
                            />
                        </label>
                        <label className="tag" >
                            <span>Desc</span>
                            <input
                                type="radio"
                                name="sortDir"
                                value="-1"
                                onChange={handleChange}
                                checked={filterByToEdit.sortDir === "-1"}                        
                            />
                        </label>
                    </div>
                </div>

                <LabelChooser 
                    labels={labels} 
                    filterBy={filterByToEdit} 
                    onSetFilterBy={setFilterByToEdit}/>
            </form>
        </section>
    )
}