import {Button} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {DataGrid} from "@mui/x-data-grid";

const ClientList = ({clients}) => {


    const removeClient = (client) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: client.id})
        };
        fetch('/api/clients/remove', requestOptions);
    };


    const ClientsGridColumns = [{field: 'id', headerName: 'ID', flex: 1},
        {field: 'name', headerName: 'Name', flex: 2},
        {field: 'ip', headerName: 'IP', flex: 2},
        {field: 'status', headerName: 'Status', flex: 1},
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            flex: 1,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    const api = params.api;
                    const thisRow = {};

                    api
                        .getAllColumns()
                        .filter((c) => c.field !== "__check__" && !!c)
                        .forEach(
                            (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
                        );

                    removeClient(thisRow);
                };

                return (
                    <div className='h-full w-full flex justify-center items-center'>
                        <Button variant='contained' size='medium' startIcon={<DeleteIcon/>} color='error'
                                onClick={onClick} className='h-3/4 w-3/4 -translate-y-0.5'>Remove</Button>
                    </div>
                );
            }
        },
    ]

    return (
        <DataGrid rows={clients}
                  columns={ClientsGridColumns} checkboxSelection
                  disableColumnSelector disableSelectionOnClick/>
    )
}

export default ClientList;