import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/userSlice';
import { useLoginMutation } from '../store/apis/userApi';
import '../styles/auth.css';



const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [login, { isLoading }] = useLoginMutation();


  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);


  const [formData, setFormData] = useState({ email: '', password: '' })
  const { email, password } = formData;


  const onChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))

  }
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      if (response.error) {
        toast.error(response.error.data?.message || response.error.error || 'Login failed');
      } else {
        dispatch(setUser(response.data));
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/');
        toast.success(`Welcome back, ${response.data.name}!`);
      }
    } catch (error) {
      toast.error('An error occurred during login');
    }
  }


  return (
    <div className='auth-page'>
      <div className='auth-container'>
        <div className='auth-header'>
          <div className='auth-logo'>🦷</div>
          <h1>Clinic Management</h1>
          <p>Dental Clinic Management System</p>
        </div>

        <div className='auth-card'>
          <div className='auth-heading'>
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={onSubmit} className='auth-form'>
            <div className='form-group'>
              <label htmlFor='email'>Email Address</label>
              <input
                required
                type='email'
                className='form-input'
                id='email'
                name='email'
                value={email}
                placeholder='your@email.com'
                onChange={onChange}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                required
                type='password'
                className='form-input'
                id='password'
                name='password'
                value={password}
                placeholder='••••••••'
                onChange={onChange}
              />
            </div>

            <button type='submit' disabled={isLoading} className='btn-login'>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className='auth-footer'>
            <p>Don't have an account? <Link to='/register'>Create one</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login