import { FaSignInAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux';

import { logoutAndReset } from '../store/slices/userSlice';


const Header = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const handleLogout = () => {
        dispatch(logoutAndReset());
        navigate('/');
    };

    // Only show header when not logged in
    if (user) {
        return null;
    }

    return (
        <header className='header'>
            <div className='logo'>
                <Link to='/'>🦷 Clinic Management</Link>
            </div>
            <ul>
                <li>
                    <Link to='/login'><FaSignInAlt /> Login</Link>
                </li>
                <li>
                    <Link to='/register'><FaSignInAlt /> Register</Link>
                </li>
            </ul>

        </header>
    )
}

export default Header;
