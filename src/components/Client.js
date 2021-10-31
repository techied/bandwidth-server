import PropTypes from 'prop-types';
import Button from "./Button";

const Client = ({client, onRemove}) => {
    return (
        <div className="client grid grid-cols-4">
            <div className="client-name">
                {client.name}
            </div>
            <div className="client-ip">
                {client.ip}
            </div>
            <div className="client-status">
                {client.status}
            </div>
            <div className="client-remove-button">
                <Button onClick={() => onRemove(client)} text="Remove" color="red"/>
            </div>
        </div>
    );
}

Client.propTypes = {
    client: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
}

export default Client;