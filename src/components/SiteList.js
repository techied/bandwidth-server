import Site from './Site';

const SiteList = ({sites}) => {

    const removeSite = (site) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({key: site.key})
        };
        fetch('/api/sites/remove', requestOptions);
    }

    return (
        <div className="site-list">
            {sites.length > 0 ? sites.map(site => <Site key={site.key} site={site}
                                                        onRemove={removeSite}/>) : 'No sites yet!'}
        </div>
    );
}

export default SiteList;