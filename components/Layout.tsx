// components/Layout.tsx
import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useDropdown, DropdownProvider } from '@/context/DropdownContextType';

const { Header, Content, Footer, Sider } = Layout;

type Props = {
  children: React.ReactNode;
};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: { label: React.ReactNode; key: React.Key }[]
) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('User Management', 'sub1', <UserOutlined />, [
    getItem('Team 1', '1'),
    getItem('Team 2', '2'),
  ]),
  getItem('Vendor Management', 'sub2', <TeamOutlined />, [
    getItem(<Link href="/vendor/register">Registration</Link>, '3'),
    getItem(<Link href="/vendor/verification">Verification</Link>, '4'),
    getItem(<Link href="/vendor/register">Evaluation</Link>, '5'),
    getItem('Master Data', 'sub4', <DatabaseOutlined />, [
      getItem(<Link href="/vendor/masterdata?type=position">Vendor Position</Link>, '6'),
      getItem(<Link href="/vendor/masterdata?type=business-field">Vendor Business Field</Link>, '9'),
      getItem(<Link href="/vendor/masterdata?type=currency">Currency</Link>, '10')
    ]),
  ]),
  getItem('User Requisition', 'sub3', <UserOutlined />, [
    getItem('Menu 1', '7'),
    getItem('Menu 2', '8'),
  ]),
];

const MyLayout: React.FC<Props> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { openKeys, setOpenKeys } = useDropdown();

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Layout className="h-full">
      <Header className="bg-blue-500 text-white flex items-center justify-between">
        <div className="text-xl">Delpis</div>
      </Header>
      <Layout>
        <Sider >
          <div className='mt-10'></div>
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            mode="inline"
            items={items}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
          />
        </Sider>
        <Layout>
          <Content>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </div>
          </Content>
          <Footer className="text-center">
            @rzkiypratama ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

const LayoutWithContext: React.FC<Props> = ({ children }) => {
  return (
    <DropdownProvider>
      <MyLayout>{children}</MyLayout>
    </DropdownProvider>
  );
};

export default LayoutWithContext;