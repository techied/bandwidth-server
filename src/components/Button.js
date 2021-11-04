import PropTypes from "prop-types";

const Button = ({onClick, text, color}) => {
    return (
        <button className='h-auto m-2 w-full w-max w-auto p-2 rounded shadow text-white' onClick={onClick}
                style={{backgroundColor: color}}>{text}</button>
    )
}

Button.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string.isRequired
}

Button.defaultProps = {
    onClick: () => {
    },
    text: "Button",
    color: "black",
    className: "h-auto m-2 w-full w-max w-auto p-2 rounded shadow text-white"
}

export default Button;