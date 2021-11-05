import {
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    Grid,
    TextField
} from "@mui/material";
import {useState} from "react";
import AddIcon from "@mui/icons-material/Add";

const AddSiteDialog = () => {

    const [backdropOpen, setBackdropOpen] = useState(false);
    const [open, setOpen] = useState(false);


    const fabStyle = {
        position: 'fixed',
        bottom: 48,
        right: 16,
        borderRadius: 32,
    }

    const addSite = () => {


        setBackdropOpen(true);
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: document.getElementById('name').value,
                url: document.getElementById('url').value,
                weight: document.getElementById('weight').value
            })
        };
        fetch('/api/sites/add', requestOptions).then(() => {
                setBackdropOpen(false)
                setOpen(false)
            }
        );
    }

    return (<>
            <Fab color='primary' aria-label='add' style={fabStyle}
                 onClick={() => {
                     setOpen(true);
                 }}>
                <AddIcon/>
            </Fab>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Site</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the name and URL of the site you want to add
                    </DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField margin="dense" id="name" label='Name' type='text' variant='standard'/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField margin="dense" id="weight" label='Weight' type='number' variant='standard'/>
                        </Grid>
                    </Grid>
                    <TextField autoFocus margin="dense" id="url" label='URL' type='url' onKeyUp={(key) => {
                        if (key.key === 'Enter') {
                            addSite();
                        }
                    }} fullWidth variant='standard'/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={() =>
                        addSite()
                    } color="primary">Save</Button>
                </DialogActions>
                <Backdrop
                    open={backdropOpen}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
            </Dialog>
        </>
    );
}

export default AddSiteDialog;