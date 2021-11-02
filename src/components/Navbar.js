import NavButton from "./NavButton";

const Navbar = () => {
    return (
        <div className='navbar navigation'>
            <ul className="flex border-b">
                <NavButton to='/' text='Home'/>
                <NavButton to='/sites' text='Site List'/>
            </ul>
        </div>
    );
}

export default Navbar;