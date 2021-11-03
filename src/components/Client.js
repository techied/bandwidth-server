import PropTypes from 'prop-types';
import Button from "./Button";

const Client = ({client, onRemove}) => {
    return (
        <tr
            className="client place-items-center border border-8">
            <td className="client-name">
                {client.name}
            </td>
            <td className="client-ip border">
                {client.ip}
            </td>
            <td className="client-status h-auto w-auto p-2 m-2">
                {client.status}
            </td>
            <td className="client-remove-button border-l hover:bg-gray-300">
                <Button onClick={() => onRemove(client)} text="Remove" color="red"/>
            </td>
        </tr>
    );
}

Client.propTypes = {
    client: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
}

export default Client;