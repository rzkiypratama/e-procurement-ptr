import React from 'react';
import { Dropdown, message, Space, Avatar } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Link from 'next/link';
import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

const ProfileAvatar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = getCookie('token');

      if (!token) {
        message.error('You are not logged in.');
        return;
      }
      const response = await axios.post('https://vendorv2.delpis.online/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        deleteCookie('token');
        deleteCookie('user_id');
        deleteCookie('vendor_id');
        message.success('Logout successful!');
        router.push('/');
      } else {
        message.error('Logout failed. Please try again.');
      }
    } catch (error) {
      message.error('An error occurred during logout. Please try again.');
    }
  };

  const items: MenuProps['items'] = [
    // {
    //   label: <Link href="/vendor/profile">Profile</Link>,
    //   key: '1',
    // },
    {
      label: (
        <div className='flex items-center gap-3' onClick={handleLogout}>
          <LogoutOutlined className='text-red-500' />Logout
        </div>
      ),
      key: '2',
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
      }}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Avatar />
        </Space>
      </a>
    </Dropdown>
  );
};

export default ProfileAvatar;