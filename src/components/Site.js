import Button from "./Button";

const Site = ({site, onRemove}) => {
    return (
        <tr
            className="site place-items-center border border-8">
            <td className="site-name">
                {site.name}
            </td>
            <td className="site-url border">
                {site.url}
            </td>
            <td className="site-weight h-auto w-auto p-2 m-2">
                {site.weight}
            </td>
            <td className="site-remove-button border-l hover:bg-gray-300">
                <Button onClick={() => onRemove(site)} text="Remove" color="red"/>
            </td>
        </tr>
    )
}

export default Site;