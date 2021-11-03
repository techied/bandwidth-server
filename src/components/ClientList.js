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
            {clients.length > 0 ?
                <table className='table-fixed'>
                    <thead>
                    <tr>
                        <th className='w-60'>Name</th>
                        <th className='w-20'>IP</th>
                        <th className='w-20'>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map(client =>
                        <Client key={client.key} client={client} onRemove={removeClient}/>
                    )}
                    </tbody>
                </table>
                : 'No clients yet'}
        </div>
    )
}

export default ClientList;