import Button from "./Button";

const Site = ({site, onRemove}) => {
    return (
        <div className="site grid grid-cols-4 place-items-center">
            <div className="site-name">
                {site.name}
            </div>
            <div className="site-url">
                {site.url}
            </div>
            <div className="site-weight">
                {site.weight}
            </div>
            <div className="site-remove-button">
                <Button onClick={() => onRemove(site)} text="Remove" color="red"/>
            </div>
        </div>
    )
}

export default Site;