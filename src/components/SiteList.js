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
            {sites.length > 0 ?
                <table className='table-fixed'>
                    <thead>
                    <tr>
                        <th className='w-60'>Name</th>
                        <th className='w-60'>URL</th>
                        <th className='w-20'>Weight</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sites.map(site =>
                        <Site key={site.key} site={site} onRemove={removeSite}/>
                    )}
                    </tbody>
                </table>
                : 'No clients yet'}
        </div>
    );
}

export default SiteList;