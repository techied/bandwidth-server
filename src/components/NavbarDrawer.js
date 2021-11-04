import {List, SwipeableDrawer, Typography} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import GlobeIcon from '@mui/icons-material/Public';
import NavButton from "./NavButton";

const drawerWidth = 240;

const NavbarDrawer = ({open, setOpen}) => {
    return (
        <SwipeableDrawer anchor='left' open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
        }}>
            <Typography variant='h6' className='center'>
                Navigation
            </Typography>
            <List>
                <NavButton to='/' setOpen={setOpen} text={'Home'} icon={<HomeIcon/>}/>
                <NavButton to='/sites' setOpen={setOpen} text={'Sites'} icon={<GlobeIcon/>}/>
            </List>

        </SwipeableDrawer>
    )
}
export default NavbarDrawer;