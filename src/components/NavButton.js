import {NavLink} from "react-router-dom";
import PropTypes from "prop-types";

const NavButton = ({to, text, exact}) => {
    return (
        <li className='mr-1 p-1'>
            {exact ? <NavLink exact
                              className="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"
                              activeClassName='bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                              to={to}>{text}</NavLink>
                :
                <NavLink
                    className="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"
                    activeClassName='bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
                    to={to}>{text}</NavLink>
            }
        </li>
    )
}

NavButton.propTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    exact: PropTypes.bool
}

NavButton.defaultProps = {
    exact: true
}

export default NavButton