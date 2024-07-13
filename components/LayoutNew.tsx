import React, { useState, useEffect } from 'react';
import { Layout, Menu, message, Spin, Flex } from 'antd';
import { UserOutlined, TeamOutlined, DatabaseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import ProfileAvatar from '@/lib/ProfileAvatar'
import axios from "axios";
import { getCookie } from 'cookies-next';
import useMenuStore from "@/store/menuStore";

const { Header, Content, Footer, Sider } = Layout;

type Props = {
  children: React.ReactNode;
};

interface ParentMenu {
  menu_name: string;
  urlto: string;
  keterangan: string;
  accessMenu: AccessMenu;
  children?: ParentMenu[] | null;
}

interface AccessMenu {
  view: boolean;
  add: boolean;
  edit: boolean;
  approve: boolean;
  ignore: boolean;
  export: boolean;
}

interface MenuItem {
  key: string;
  icon: JSX.Element;
  label: string | JSX.Element;
  children?: MenuItem[];
}

function getItem(
  label: string | JSX.Element,
  key: string,
  icon: JSX.Element,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    label,
    children,
  };
}

const MyLayout: React.FC<Props> = ({ children }) => {
  const token = getCookie("token");
  const userRole = getCookie("group_user_code"); // Assume the role is stored in a cookie called "role"
  const [menuList, setMenuList] = useState<ParentMenu[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  // Define all menu items
  const allMenuItems: MenuItem[] = [
    getItem(<Link href="https://eproc.delpis.online/admin" target='_blank'>User Management</Link>, '1', <UserOutlined />),
    {
      key: 'sub2',
      icon: <TeamOutlined />,

      label: 'Vendor Management',
      children: [
        getItem(<Link href="/vendor/profile">Company Profile</Link>, '9', <div />),
        getItem(<Link href="/vendor/registration-list">Vendor List</Link>, '3', <div />),
        getItem(<Link href="/vendor/verification">Verification</Link>, '4', <div />),
        getItem(<Link href="/vendor/register">Evaluation</Link>, '5', <div />),
        {
          key: 'sub1-3',
          label: 'Master Data',
          icon: <DatabaseOutlined />,
          children: [
            getItem(<Link href="/vendor/masterdata?type=position">Vendor Position</Link>, '6', <div />),
            getItem(<Link href="/vendor/masterdata?type=business-field">Vendor Business Field</Link>, '7', <div />),
            getItem(<Link href="/vendor/masterdata?type=currency">Currency</Link>, '8', <div />)
          ],
        },
      ],
    },
  ];

  // Filter menu items based on user role
  const getFilteredMenuItems = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          getItem(<Link href="https://eproc.delpis.online/admin" target='_blank'>User Management</Link>, '1', <UserOutlined />),
          {
            key: 'sub2',
            icon: <TeamOutlined />,

            label: 'Vendor Management',
            children: [
              getItem(<Link href="/vendor/registration-list">Vendor List</Link>, '3', <div />),
              {
                key: 'sub1-3',
                label: 'Master Data',
                icon: <DatabaseOutlined />,
                children: [
                  getItem(<Link href="/vendor/masterdata?type=position">Vendor Position</Link>, '6', <div />),
                  getItem(<Link href="/vendor/masterdata?type=business-field">Vendor Business Field</Link>, '7', <div />),
                  getItem(<Link href="/vendor/masterdata?type=currency">Currency</Link>, '8', <div />)
                ],
              },
            ],
          },
          {
            key: 'sub3',
            icon: <TeamOutlined />,
            label: <Link href="/user-requisition">User Requisition</Link>,
            children: [
              getItem(<Link href="/user-requisition/pengadaan-barang">Pengadaan Barang</Link>, '9', <div />),
            ],
          },
          {
            key: 'sub4',
            icon: <TeamOutlined />,
            label: <Link href="/master-budget">Master Budget</Link>,
            children: [
              getItem(<Link href="/master-budget/add">Input Anggaran</Link>, '11', <div />),
            ],
          }
        ]; // Admin can see all menus
      case 'verifikator':
        return [
          {
            key: 'sub2',
            icon: <TeamOutlined />,
            label: 'Vendor Management',
            children: [
              getItem(<Link href="/vendor/registration-list">Vendor List</Link>, '3', <div />),
              getItem(<Link href="/vendor/verification">Verification</Link>, '4', <div />),
            ],
          }
        ];
      case 'ppk':
        return [
          {
            key: 'sub2',
            icon: <TeamOutlined />,
            label: 'Vendor Management',
            children: [
              getItem(<Link href="/vendor/registration-list">Vendor List</Link>, '3', <div />),
              getItem(<Link href="/vendor/register">Evaluation</Link>, '5', <div />),
            ],
          }
        ];
      case 'vendor':
        return [
          {
            key: 'sub2',
            icon: <TeamOutlined />,
            label: 'Vendor Management',
            children: [
              getItem(<Link href="/vendor/profile">Company Profile</Link>, '9', <div />),
            ],
          },
          {
            key: 'sub3',
            icon: <TeamOutlined />,
            label: "User Requisition",
            children: [
              getItem(<Link href="/user-requisition/dashboard">Dashboard</Link>, '12', <div />),
              getItem(<Link href="/user-requisition/pengadaan">Pengadaan Barang</Link>, '10', <div />),
              {
                key: 'sub5',
                icon: <TeamOutlined />,
                label: "Master Data",
                children: [
                  getItem(<Link href="/user-requisition/master-data/department">Department</Link>, '14', <div />),
                ],
              },
            ],
          },
          {
            key: 'sub4',
            icon: <TeamOutlined />,
            label: "Master Budget",
            children: [
              getItem(<Link href="/master-budget/dashboard">Dashboard</Link>, '13', <div />),
              getItem(<Link href="/master-budget/input-anggaran">Input Anggaran</Link>, '11', <div />),
            ],
          }
        ];
      default:
        return [];
    }
  };

  const filteredMenuItems = getFilteredMenuItems(userRole as string);

  return (
    <Layout className="">
      <Header className="bg-blue-500 text-white flex items-center justify-between">
        <div className="text-xl">Delpis</div>
        <ProfileAvatar />
      </Header>
      {isLoading ? (
        <div className="h-96 content-center place-content-center">
          <Flex gap="small" vertical>
            <Spin tip="Loading" size="large" fullscreen={true}>
              <div></div>
            </Spin>
          </Flex>
        </div>
      ) : (
        <Layout className=''>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} theme='light'>
            <div className="demo-logo-vertical" />
            <Menu theme="light" defaultSelectedKeys={['9']} mode="inline">
              {filteredMenuItems.map((item) =>
                item.children ? (
                  <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                    {item.children.map((child) =>
                      child.children ? (
                        <Menu.SubMenu key={child.key} icon={child.icon} title={child.label}>
                          {child.children.map((subChild) => (
                            <Menu.Item key={subChild.key}>{subChild.label}</Menu.Item>
                          ))}
                        </Menu.SubMenu>
                      ) : (
                        <Menu.Item key={child.key} icon={child.icon}>
                          {child.label}
                        </Menu.Item>
                      )
                    )}
                  </Menu.SubMenu>
                ) : (
                  <Menu.Item key={item.key} icon={item.icon}>
                    {item.label}
                  </Menu.Item>
                )
              )}
            </Menu>
          </Sider>
          <Layout className="site-layout flex flex-col min-h-screen">
            <Content className="flex-1" style={{ margin: '0 16px' }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                {children}
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Delpis ©{new Date().getFullYear()}
            </Footer>
          </Layout>
        </Layout>
      )}
    </Layout>
  );
};

export default MyLayout;