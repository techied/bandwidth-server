import {useHistory} from "react-router-dom";
import PropTypes from "prop-types";
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";


const NavButton = ({to, text, icon, setOpen}) => {

    const history = useHistory();

    const handleClick = () => {
        history.push(to);
        setOpen(false);
    }

    return (
        <ListItem button onClick={() => {
            handleClick()
        }}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={text}/>
        </ListItem>
    )
}

NavButton.propTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    setOpen: PropTypes.func.isRequired
}

NavButton.defaultProps = {
    to: '/',
    text: 'Home',
    icon: <HomeIcon/>,
    setOpen: () => {
    }
}

export default NavButton