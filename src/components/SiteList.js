import Site from './Site';
import Button from "./Button";

const SiteList = ({sites}) => {

    const removeSite = (site) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({key: site.key})
        };
        fetch('/api/sites/remove', requestOptions);
    }

    const addSite = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: document.querySelector('.site-name input').value,
                url: document.querySelector('.site-url input').value,
                weight: document.querySelector('.site-weight input').value
            })
        };
        fetch('/api/sites/add', requestOptions);
    }

    return (
        <div className="site-list">
            {sites.length > 0 ?
                <table className='table-auto h-1 overflow-clip'>
                    <thead>
                    <tr>
                        <th className='w-60'>Name</th>
                        <th className='w-60 overflow-clip h-1'>URL</th>
                        <th className='w-20'>Weight</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sites.map(site =>
                        <Site key={site.key} site={site} onRemove={removeSite}/>
                    )}
                    <tr
                        className="site place-items-center border border-8">
                        <td className="site-name">
                            <input type='text' placeholder='Site Name'/>
                        </td>
                        <td className="site-url border">
                            <input type='text' placeholder='Site URL'/>
                        </td>
                        <td className="site-weight h-auto w-auto p-2 m-2">
                            <input type='number' placeholder='Weight' min='0' max='100'/>
                        </td>
                        <td className="site-remove-button border-l hover:bg-gray-300">
                            <Button onClick={() => addSite()} text='Add' color='green'
                                    className='h-auto m-2 w-full p-2 rounded shadow text-white'/>
                        </td>
                    </tr>
                    </tbody>
                </table>
                : 'No clients yet'}
        </div>
    );
}

export default SiteList;