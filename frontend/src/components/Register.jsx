import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import { toast } from 'react-toastify';
import { setUser } from '../store/slices/userSlice';
import { useRegisterMutation } from '../store/apis/userApi';

import { useState } from 'react'
import '../styles/auth.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', password2: '' })
  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))

  }

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      const response = await register(formData);
      if (response.error) {
        toast.error(response.error.data?.message || response.error.error || 'Registration failed');
      } else {
        dispatch(setUser(response.data));
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/');
        toast.success('Registration successful');
      }
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
            <h2>Create Account</h2>
            <p>Join us to manage your clinic</p>
          </div>

          <form onSubmit={onSubmit} className='auth-form'>
            <div className='form-group'>
              <label htmlFor='name'>Full Name</label>
              <input
                type='text'
                className='form-input'
                id='name'
                name='name'
                value={name}
                placeholder='John Doe'
                onChange={onChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='email'>Email Address</label>
              <input
                type='email'
                className='form-input'
                id='email'
                name='email'
                value={email}
                placeholder='your@email.com'
                onChange={onChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                className='form-input'
                id='password'
                name='password'
                value={password}
                placeholder='••••••••'
                onChange={onChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password2'>Confirm Password</label>
              <input
                type='password'
                className='form-input'
                id='password2'
                name='password2'
                value={password2}
                placeholder='••••••••'
                onChange={onChange}
                required
              />
            </div>

            <button type='submit' className='btn-register' disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className='auth-footer'>
            <p>Already have an account? <Link to='/login'>Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register