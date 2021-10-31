import PropTypes from 'prop-types';
import Button from "./Button";

const Client = ({key, client, onRemove}) => {
    return (
        <div className="client" key={key}>
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
                <Button onClick={() => onRemove(client)} text="Remove Client" color="red"/>
            </div>
        </div>
    );
}

Client.propTypes = {
    key: PropTypes.string.isRequired,
    client: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
}

export default Client;