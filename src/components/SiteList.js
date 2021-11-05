import DeleteIcon from "@mui/icons-material/Delete";
import {DataGrid} from "@mui/x-data-grid";
import {Button} from "@mui/material";
import AddSiteDialog from "./AddSiteDialog";

const SiteList = ({sites}) => {

    const removeSite = (site) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: site.id})
        };
        fetch('/api/sites/remove', requestOptions);
    }

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
                    <div className='list center'>
                        <Button variant='contained' size='medium' startIcon={<DeleteIcon/>} color='error'
                                onClick={onClick} className='remove-btn'>Remove</Button>
                    </div>
                );
            }
        },
    ]

    return (
        <>
            <DataGrid rows={sites}
                      columns={SitesGridColumns} checkboxSelection
                      disableColumnSelector disableSelectionOnClick/>

            <AddSiteDialog/>
        </>
    );
}

export default SiteList;