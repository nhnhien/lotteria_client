import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Spin, Alert, Button } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import useAuth from '../../hook/useAuth';
import { getOrderByUser } from '../../service/order';
import { formatCurrencyUSD, formatCurrencyVND } from '../../util/format';

const { Title, Text } = Typography;

const OrderScreen = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderByUser(userId);
        setOrders(data.orders);
      } catch (err) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleRePayment = (orderId) => {
    console.log(`Processing repayment for order #${orderId}`);
  };
  const handleCancelOrder = () => {
    console.log(123);
  };
  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );
  }
  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Alert message={error} type='error' showIcon />
      </div>
    );
  }
  const convertToUSD = (amountVND, exchangeRate = 25000) => {
    return (amountVND / exchangeRate).toFixed(2);
  };
  return (
    <div className='p-6 max-w-screen-lg mx-auto'>
      <Title level={2} className='text-center text-gray-800 mb-6'>
        Your Orders
      </Title>
      <List
        itemLayout='vertical'
        size='large'
        dataSource={orders}
        renderItem={(order) => (
          // <List.Item
          //   key={order.id}
          //   className='bg-pink-50 shadow-lg rounded-lg mb-6 hover:shadow-xl transition-shadow duration-300 ease-in-out'
          //   extra={
          //     <div>
          //       {order.status === 'delivered' ? (
          //         <CheckCircleOutlined
          //           style={{ color: 'green', fontSize: '24px' }}
          //         />
          //       ) : (
          //         <CloseCircleOutlined
          //           style={{ color: 'red', fontSize: '24px' }}
          //         />
          //       )}
          //     </div>
          //   }
          // >
          <List.Item
  key={order.id}
  className={`shadow-lg rounded-lg mb-6 hover:shadow-xl transition-shadow duration-300 ease-in-out ${
    order.deliveries[0]?.status === "delivered" ? "border-2 border-green-500 bg-green-50" : "bg-pink-50"
  }`}
  extra={
    <div>
      {order.deliveries[0]?.status === "delivered" ? (
        <CheckCircleOutlined style={{ color: "green", fontSize: "24px" }} />
      ) : (
        <CloseCircleOutlined style={{ color: "red", fontSize: "24px" }} />
      )}
    </div>
  }
>

            <Card
              title={`Order #${order.id}`}
              bordered={false}
              className='w-full'
              style={{ padding: '6px' }}
              extra={
                // <Text strong className='text-2xl text-gray-700'>
                //   {formatCurrencyUSD(order.total_price)}
                // </Text>
                <Text strong className='text-2xl text-gray-700'>
  {convertToUSD(order.total_price)} USD
</Text>

              }
            >
              <div className='flex justify-between mb-4'>
                <div>
                  <Text>Status: </Text>
                  <span
                    className={`uppercase font-semibold ${
                      order.payments[0].status === 'completed'
                        ? 'text-green-500'
                        : order.payments[0].status === 'failed'
                        ? 'text-red-500'
                        : order.payments[0].status === 'cancelled'
                        ? 'text-yellow-500'
                        : order.payments[0].status === 'refunded'
                        ? 'text-blue-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {order.payments[0].status}
                  </span>
                  <span className='pl-5'> 
                    Delivery:{order.deliveries[0].status}
                  </span>

                  {['failed', 'pending'].includes(order.payments[0].status) && (
                    <Button
                      type='primary'
                      className='mt-4 bg-blue-600 ml-10'
                      onClick={handleRePayment}
                      size='small'
                    >
                      Repayment
                    </Button>
                  )}
                  {/* {(order.payments[0].status !== 'completed' ||
                    order.payments[0].status !== 'cancelled') && (
                    <Button
                      type='primary'
                      className='mt-4 ml-4'
                      onClick={() => handleCancelOrder(order.id)}
                      size='small'
                    >
                      Cancel Order
                    </Button>
                  )} */}
                    {(order.payments[0].status !== 'completed' ||
                    order.payments[0].status !== 'cancelled')}
                </div>
                <div className='text-sm text-gray-500'>
                  <Text>Placed on:</Text>{' '}
                  {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>

        {/* User Information */}
        <div>
          <Title level={5} className='text-gray-700'>
            User Information:
          </Title>
          <div>
            <Text className='font-medium'>Username: </Text>
            <span>{order.user.username}</span>
          </div>
          <div>
            <Text className='font-medium'>Phone: </Text>
            <span>{order.user.phone}</span>
          </div>
          <div>
            <Text className='font-medium'>Email: </Text>
            <span>{order.user.email}</span>
          </div>
        </div>

        {/* Order Note */}
        <div>
          <Text className='font-medium'>Note: </Text>
          <span>{order.note || 'No additional notes'}</span>
        </div>

        {/* Delivery Address */}
        <div>
          <Text className='font-medium'>Address: </Text>
          <span>{order.deliveries[0]?.address || 'No delivery address provided'}</span>
        </div>
              <div className='mt-6'>
                <Title level={5} className='text-gray-700'>
                  Order Details:
                </Title>
                <List
                  dataSource={order.orderDetails}
                  renderItem={(detail) => (
                    // <List.Item
                    //   key={detail.product_id}
                    //   className='bg-white rounded-lg shadow-md mb-2 p-2 hover:bg-gray-50 transition-colors duration-200 ease-in-out'
                    // >
                    <List.Item
  key={detail.product_id}
  className={`rounded-lg shadow-md mb-2 p-2 transition-colors duration-300 ease-in-out ${
    order.deliveries[0]?.status === "delivered" ? "bg-green-100" : "bg-white"
  }`}
>

                      <div className='flex items-center space-x-4'>
                        <img
                          src={detail.product.image || '/default-image.jpg'}
                          alt={detail.product.name}
                          className='w-16  object-cover rounded-lg shadow-md transition-transform duration-200 ease-in-out hover:scale-105' // Giảm kích thước ảnh
                        />
                        <div className='flex-1'>
                          <Text className='font-semibold text-gray-900'>
                            {detail.product_name}
                          </Text>
                          <div className='text-sm text-gray-600'>
                            {detail.options || ''}
                          </div>
                        </div>
                        <div className='text-right'>
                          <Text className='font-semibold text-gray-500'>
                            {detail.quantity} x{' '}
                            <span className='text-red-500'>
                              {formatCurrencyUSD(detail.price)}
                            </span>
                          </Text>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </List.Item>
        )}
      />
      <div className='text-center mt-8'>
        {/* <Button
          type='primary'
          size='large'
          className='bg-blue-600 hover:bg-blue-700 transition duration-300 text-white'
        >
          View More Orders
        </Button> */}
      </div>
    </div>
  );
};

export default OrderScreen;
