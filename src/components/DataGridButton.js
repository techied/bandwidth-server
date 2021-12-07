import {Button} from "@mui/material";

const DataGridButton = ({onClick, icon, text}) => {
    const buttonStyle = {
        borderRadius: 4
    }

    const _onClick = (e) => {
        e.stopPropagation(); // don't select this row after clicking
        onClick(e);
    };

    return (
        <div className='list center'>
            <Button variant='contained' size='medium' style={buttonStyle} startIcon={icon}
                    color='error'
                    onClick={_onClick} className='remove-btn'>{text}</Button>
        </div>)
}

export default DataGridButton;