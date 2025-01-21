import React from 'react';
import logo from '../../assets/images/quickchicken_logo.png';

const Footer = () => {
  const columnFooter = [
    {
      id: 1,
      title: 'INFORMATION',
      fields: [
        { id: 1, name: 'News' },
        { id: 2, name: 'Promotions' },
        { id: 3, name: 'Careers' },
        { id: 4, name: 'Franchise' },
      ],
    },
    {
      id: 2,
      title: 'SUPPORT',
      fields: [
        { id: 1, name: 'Terms of Use' },
        { id: 2, name: 'Privacy Policy' },
        { id: 3, name: 'Delivery Policy' },
        { id: 4, name: 'Customer Service' },
      ],
    },
    {
      id: 3,
      title: 'FOLLOW US',
      fields: [
        {
          id: 1,
          name: 'Facebook',
          icon: (
            <img
              src='https://www.lotteria.vn/grs-static/images/icon-fb-2.svg'
              alt='Facebook'
            />
          ),
        },
        {
          id: 2,
          name: 'Instagram',
          icon: (
            <img
              src='https://www.lotteria.vn/grs-static/images/icon-instagram.svg'
              alt='Instagram'
            />
          ),
        },
        {
          id: 3,
          name: 'Zalo',
          icon: (
            <img
              src='https://www.lotteria.vn/grs-static/images/icon-zalo.svg'
              alt='Zalo'
            />
          ),
        },
      ],
    },
  ];

  return (
    <div className='bg-[#FFEAE3] pt-10'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-8'>
          <div className='col-span-2 flex flex-col items-center'>
            <img src={logo} alt='Lotteria Logo' width='85px' />
            <p className='text-lg font-medium pt-4'>
              SUBSCRIBE TO RECEIVE PROMOTION INFORMATION
            </p>
            <div className='relative'>
              <input
                placeholder='Enter your email'
                className='w-[150px] md:w-[250px] lg:w-[345px] py-3 px-2 mt-4 outline-none focus:border-footer-second border-[2px] rounded-md'
              />
              {/* <button className='text-red-500 text-lg absolute top-7 right-5'>
                Submit
              </button> */}
            </div>
          </div>
          {columnFooter.map((col) => (
            <div key={col.id}>
              <h3 className='text-xl text-black font-semibold mb-4'>
                {col.title}
              </h3>
              <ul className='space-y-[6px]'>
                {col.fields.map((field) => (
                  <li
                    key={field.id}
                    className={`${
                      field.icon ? 'flex space-x-2 items-center' : ''
                    }`}
                  >
                    <div>{field?.icon}</div>
                    <a href='#' className='text-black hover:text-white'>
                      {field.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className='text-center mt-12 border-t py-4 bg-footer-second'>
      </div>
    </div>
  );
};

export default Footer;
