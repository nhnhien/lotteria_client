import { Button, Modal, Input, notification } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalTypes } from '../../constant/modal';
import { closeModal, openModal } from '../../redux/slice/modal';
import { FaTimes } from 'react-icons/fa';
import { signIn } from '../../service/auth';
import { loginSuccess } from '../../redux/slice/auth';
import useAuth from '../../hook/useAuth';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/quickchicken_logo.png';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const signInModal = useSelector(
    (state) => state.modal.modals[ModalTypes.SIGN_IN],
  );
  const handleCancel = () => {
    dispatch(closeModal({ name: ModalTypes.SIGN_IN }));
  };

  const handleSignIn = async () => {
    try {
      const userSignIn = { email, password };
      const result = await signIn(userSignIn);
      if (result && result.success) {
        console.log('result', result);
        notification.success({
          message: 'Login successful',
          description: 'You have logged in successfully!',
        });
        dispatch(closeModal({ name: ModalTypes.SIGN_IN }));
        dispatch(loginSuccess({ ...result.user, token: result.token }));
        if (result.user.role == 'owner') {
          navigate('/admin');
        }
      }
    } catch (error) {
      const messageError = error.response.data.message;
      console.error('Login error:', messageError);
      notification.error({
        message: 'Login failed',
        description: messageError,
      });
    }
  };

  return (
    <div>
      <Modal
        open={signInModal.isOpen}
        onCancel={handleCancel}
        closable={false}
        footer={null}
        width='800px'
        height={'100px'}
        className='custom-modal'
      >
        <div className='grid grid-cols-2 gap-3'>
          <div className='p-5'>
            <h2 className='text-2xl font-bold text-center mb-6'>Sign In</h2>
            <div>
              <div className='mb-4'>
                <label
                  htmlFor='phoneOrEmail'
                  className='text-base block text-gray-700'
                >
                  Phone number/Email
                </label>
                <Input
                  placeholder='Phone number/email'
                  className='focus:border-footer-second hover:border-footer-second h-10 mt-2 border-gray-300 border-2'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='mb-4'>
                <label
                  htmlFor='phoneOrEmail'
                  className='text-base block text-gray-700'
                >
                  Password
                </label>
                <Input
                  placeholder='Password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='focus:border-footer-second hover:border-footer-second h-10 mt-2 border-gray-300 border-2'
                />
              </div>
            </div>

            <button
              onClick={handleSignIn}
              className='w-full bg-red-500 text-white p-2 rounded-lg mt-4 hover:bg-red-600'
            >
              Continue
            </button>
            <div className='text-center mt-4'>
              <p
                className='text-red-500 text-base hover:text-gray-700'
                onClick={() => {
                  dispatch(closeModal({ name: ModalTypes.SIGN_IN }));
                  dispatch(
                    openModal({ name: ModalTypes.SIGN_UP, content: null }),
                  );
                }}
              >
                Don't have an account? Sign up
              </p>
            </div>
            {/* <div className='text-center pt-4'>Or sign in with</div> */}

            {/* <div className='flex justify-center mt-8 space-x-4'>
              <Button
                icon={
                  <img src='https://www.lotteria.vn/grs-static/images/icon-fb.svg' />
                }
                className='h-[50px] text-blue-500'
              >
                Facebook
              </Button>
              <Button
                icon={
                  <img src='https://www.lotteria.vn/grs-static/images/icon-google.svg' />
                }
                className='h-[50px]'
              >
                Google
              </Button>
            </div> */}
          </div>
          <div className='rounded-r-lg flex justify-center items-center'>
  <img
    src={logo}
    alt='QuickChicken Logo'
    className='w-full max-w-md lg:max-w-lg' 
  />
</div>
        </div>
      </Modal>
    </div>
  );
};
export default SignInScreen;
