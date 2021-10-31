import Client from './Client'
import PropTypes from 'prop-types'

const ClientList = ({clients, onRemove}) => {
    return (
        <div className="client-list">
            {clients.length > 0 ? clients.map(client => <Client key={client.key} client={client}
                                                                onRemove={onRemove}/>) : 'No clients yet!'}
        </div>
    )
}

ClientList.propTypes = {
    onRemove: PropTypes.func.isRequired
}

export default ClientList;