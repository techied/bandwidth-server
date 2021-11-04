import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import {useState} from "react";
import MenuIcon from '@mui/icons-material/Menu';
import NavbarDrawer from "./NavbarDrawer";


const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <Box sx={{flexGrow: 1}}>
            <NavbarDrawer open={drawerOpen} setOpen={setDrawerOpen}/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={() => {
                            setDrawerOpen(!drawerOpen)
                        }}
                    >

                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Bandwidth Server
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )

}

export default Navbar;