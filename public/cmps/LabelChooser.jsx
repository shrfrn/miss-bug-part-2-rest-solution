const { useState, useEffect } = React

export function LabelChooser({ labels, filterBy, onSetFilterBy }) {
    const labelMap = {}
    labels.forEach(label => labelMap[label] = false)

    const [ selectedLabels, setSelectedLabels ] = useState(labelMap)

    useEffect(() => {
        onSetFilterBy({ ...filterBy, 
            labels: Object.keys(selectedLabels)
                .filter(label => selectedLabels[label]) })
    }, [selectedLabels])

    function handleChange({ target }) {
        const { name, checked } = target
        setSelectedLabels(prev => ({ ...prev, [name]: checked }))
    }

    return <fieldset>
        {labels.map((label) => 
            <label key={label}>
                <input 
                    onClick={handleChange} 
                    name={label}
                    type="checkbox" />
                <span>{label}</span>
            </label>)}
    </fieldset>
}