import DeleteIcon from "@mui/icons-material/Delete";
import {DataGrid} from "@mui/x-data-grid";
import {Button} from "@mui/material";

const SiteList = ({sites}) => {

    const removeSite = (site) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: site.id})
        };
        fetch('/api/sites/remove', requestOptions);
    }

    // const addSite = () => {
    //     const requestOptions = {
    //         method: 'PUT',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify({
    //             name: document.querySelector('.site-name input').value,
    //             url: document.querySelector('.site-url input').value,
    //             weight: document.querySelector('.site-weight input').value
    //         })
    //     };
    //     fetch('/api/sites/add', requestOptions);
    // }

    const SitesGridColumns = [{field: 'id', headerName: 'ID', flex: 1},
        {field: 'name', headerName: 'Name', flex: 2},
        {field: 'url', headerName: 'URL', flex: 2},
        {field: 'weight', headerName: 'Weight', flex: 1},
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

                    removeSite(thisRow);
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
        <DataGrid rows={sites}
                  columns={SitesGridColumns} checkboxSelection
                  disableColumnSelector disableSelectionOnClick/>
    );
}

export default SiteList;