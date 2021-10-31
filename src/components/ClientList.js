import Client from './Client'
import PropTypes from 'prop-types'

const ClientList = ({clients, onRemove}) => {
    return (
        <div className="client-list">
            {clients ? clients.map(client => <Client key={client.id} client={client}
                                                     onRemove={onRemove}/>) : 'No clients yet!'}
        </div>
    )
}

ClientList.propTypes = {
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRemove: PropTypes.func.isRequired
}

export default ClientList;