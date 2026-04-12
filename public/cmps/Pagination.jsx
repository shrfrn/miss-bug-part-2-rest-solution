const PAGE_SIZE = 3

export function Pagination({ pageCount, filterBy, onSetFilterBy }) {

    function onTogglePagination(ev) {
        const paginationOn = ev.target.checked
        if (paginationOn) {
            onSetFilterBy({ pageIdx: 0, pageSize: PAGE_SIZE })
        } else {
            onSetFilterBy({ pageIdx: undefined })
        }
    }
    
    function onPage(diff) {
        const pageIdx = filterBy.pageIdx + diff
        onSetFilterBy({ pageIdx })
    }

    return <div className="pagination">
        <label className="tag">Pagination
            <input onChange={onTogglePagination} type="checkbox" />
        </label>
        <button 
            disabled={filterBy.pageIdx === 0} 
            onClick={() => onPage(-1)}>Prev</button>

        <button 
            disabled={filterBy.pageIdx === pageCount - 1} 
            onClick={() => onPage(1)}>Next</button>
    </div>
}