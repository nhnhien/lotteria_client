import React, { useState } from 'react';
import { Button, Input, message, Select, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCart,
  selectCartDiscountedTotalPrice,
  selectCartItems,
  selectCartNote,
  selectCartTotalPrice,
  updateCart,
} from '../../redux/slice/cart';
import { formatCurrencyUSD, formatCurrencyVND } from '../../util/format';
import CartDiscount from './CartDiscount';
import { createOrder } from '../../service/order';
import payment from '../../service/payment';
import useAuth from '../../hook/useAuth';

const CartOptions = () => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const cartItems = useSelector(selectCartItems);
  console.log('🚀 ~ CartOptions ~ cartItems :', cartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const discountedTotalPrice = useSelector(selectCartDiscountedTotalPrice);
  const note = useSelector(selectCartNote);
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone_order, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  const handleContinue = async () => {
    if (!cartItems || cartItems.length === 0) {
      return message.error('Your cart is empty.');
    }
    if (!shippingAddress || !phone_order || !paymentMethod) {
      return message.error('Please enter all required information.');
    }
    const final_price =
      discountedTotalPrice > totalPrice ? totalPrice : discountedTotalPrice;
    const orderData = {
      userId,
      totalPrice: final_price * 25000,
      orderDetails: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.discounted_price,
      })),
      shippingAddress,
      phone_order,
      paymentMethod,
      note,
    };
    console.log("🚀 ~ handleContinue ~ orderData:", orderData)

    try {
      const orderRes = await createOrder(orderData);
      if (orderRes && orderRes.success && orderRes.order) {
        const orderCreated = orderRes.order;
        const paymentData = {
          paymentId: orderCreated.payment_id,
          totalPrice: orderCreated.total_price,
          returnUrl: 'http://localhost:5173/payment/vnpay-return',
        };

        const paymentRes = await payment(paymentData);
        if (paymentRes && paymentRes.success) {
          window.location.href = paymentRes.paymentUrl;
        } else {
          message.error('Payment failed, please try again.');
        }
      } else {
        message.error('Order creation failed, please try again.');
      }
    } catch (error) {
      message.error('Order failed, please try again.');
    }
  };

  return (
    <div className='w-full bg-white p-6 rounded-lg shadow-lg mt-6 lg:mt-0 lg:ml-6'>
      <h3 className='text-xl font-semibold text-gray-700 mb-3'>
      Shipping information
      </h3>

      <div className='mb-6'>
        <div className='space-y-2 mb-2'>
          <label className='block text-md font-medium text-gray-600'>
          Shipping address
          </label>
          <Input.TextArea
            rows={2}
            placeholder='Enter your shipping address...'
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className='rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-md font-medium text-gray-600'>
          Receiver's phone number
          </label>
          <Input
            placeholder='Enter your phone number...'
            value={phone_order}
            type='text'
            onChange={(e) => setPhone(e.target.value)}
            className='rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className='border-t border-red-300 my-6'></div>
      <div>
        <div className='mt-6'>
          <CartDiscount />
        </div>
        <div className='mb-6'>
          <label className='block text-md font-medium text-gray-600'>
          Select payment method          </label>
          <Select
            value={paymentMethod}
            onChange={setPaymentMethod}
            defaultValue='credit_card'
            className='w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
            placeholder='Select payment method'
          >
            <Select.Option value='vnpay'>VNPay wallet</Select.Option>
            {/* <Select.Option value='cod'>Cash on delivery</Select.Option> */}
          </Select>
        </div>
        <div className='flex justify-between text-lg text-gray-700'>
          <span>Subtotal:</span>
          <span
            className={`font-semibold ${
              discountedTotalPrice < totalPrice
                ? 'line-through text-gray-500'
                : ''
            }`}
          >
            {formatCurrencyUSD(totalPrice)}
          </span>
        </div>
        <div className='flex justify-between text-xl font-semibold text-gray-800 mt-2'>
          <span>Total:</span>
          {discountedTotalPrice < totalPrice ? (
            <span className='text-red-600'>
              {formatCurrencyUSD(discountedTotalPrice || totalPrice)}
            </span>
          ) : (
            <span className='text-red-600'>{formatCurrencyUSD(totalPrice)}</span>
          )}
        </div>

        <Button
          type='primary'
          className='w-full mt-6 py-3 text-lg font-semibold bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 transition duration-300'
          size='large'
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CartOptions;
