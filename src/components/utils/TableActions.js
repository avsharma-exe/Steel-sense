import Fab from '@mui/material/Fab'

import TrashCan from 'mdi-material-ui/TrashCan'
import Eye from 'mdi-material-ui/Eye'

import Pencil from 'mdi-material-ui/Pencil'


const TableActions = ({ editRow, deleteRow, viewRow, row}) => {
    return (
        <>

            {editRow ? <Fab size="small" color="primary" aria-label="add" onClick={() => editRow(row)}>
                <Pencil />
            </Fab> : null}
            {deleteRow ? <Fab size="small" color="primary" aria-label="add" onClick={() => deleteRow(row)}>
                <TrashCan />
            </Fab> : null}
            {viewRow ? <Fab size="small" color="primary" aria-label="add" onClick={() => viewRow(row)}>
                <Eye />
            </Fab> : null}
            
        </>
    );
}

export default TableActions;