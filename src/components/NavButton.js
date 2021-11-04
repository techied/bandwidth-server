import {useHistory} from "react-router-dom";
import PropTypes from "prop-types";
import {Button} from "@mui/material";


const NavButton = ({to, text}) => {

    const history = useHistory();

    function handleClick() {
        history.push(to);
    }

    return (
        <li className='mr-1 p-1'>


            <Button onClick={() => handleClick()}>{text}</Button>
        </li>
    )
}

NavButton.propTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
}

export default NavButton