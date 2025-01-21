import React from 'react';
import { Steps, Button, Empty } from 'antd';
import CartItems from './CartItems';
import CartOptions from './CartOption';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../../redux/slice/cart';
import { Link } from 'react-router-dom';
import emptyCartImage from '../../assets/images/empty-cart.png';

const CartScreen = () => {
  const cartItems = useSelector(selectCartItems);
  if (!cartItems || cartItems?.length === 0) {
    return (
      <div className='bg-pink-50'>
        <div className='col-span-12 flex flex-col items-center justify-center text-center py-10 h-[60vh]'>
          <Empty
            description='Your cart is currently empty.'
            image={emptyCartImage}
            imageStyle={{ height: 250 }}
          />
          <Link to='/'>
            <Button size='large' type='primary' className='mt-4 text-xl'>
            Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-pink-50'>
      <div className='bg-pink-50 p-6 container'>
        <div className='flex justify-between items-center border-b border-red-200 pb-4'>
          <div>
            <Steps
              size='default'
              current={0}
              direction='horizontal'
              items={[{ title: 'Cart' }, { title: 'Checkout' }]}
            />
          </div>
        </div>

        <div className='grid grid-cols-12 gap-6 mt-6'>
          <div className='col-span-12 lg:col-span-8'>
            <CartItems cartItems={cartItems} />
          </div>

          <div className='col-span-12 lg:col-span-4'>
            <CartOptions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
