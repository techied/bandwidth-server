import Client from './Client'

const ClientList = ({clients}) => {

    const removeClient = (client) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({key: client.key})
        };
        fetch('/api/clients/remove', requestOptions);
    };

    return (
        <div className="client-list">
            {clients.length > 0 ? clients.map(client => <Client key={client.key} client={client}
                                                                onRemove={removeClient}/>) : 'No clients yet!'}
        </div>
    )
}

export default ClientList;