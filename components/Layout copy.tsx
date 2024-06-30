'use client'
import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDropdown, DropdownProvider } from '@/contexts/DropdownContextType';

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
    getItem(<Link href="/vendor/verification">Registration</Link>, '1'),
    getItem('Team 2', '2'),
  ]),
  getItem('Vendor Management', 'sub2', <TeamOutlined />, [
    getItem(<Link href="/vendor/register">Registration</Link>, '3'),
    getItem(<Link href="/vendor/">Verification</Link>, '4'),
    getItem(<Link href="/vendor/evaluation">Evaluation</Link>, '5'),
    getItem(<Link href="/vendor/master-data">Master Data</Link>, '6'),
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
  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  

  useEffect(() => {
    // Set the selected keys based on the current path
    const newSelectedKeys = items.flatMap(item =>
      item.children?.find(child => {
        const href = React.isValidElement(child.label) ? child.label.props.href : null;
        return href === pathname;
      })?.key || []
    ).map(key => String(key)); // Ensure all keys are converted to string
  
    setSelectedKeys(newSelectedKeys);
    setOpenKeys(newSelectedKeys);
  }, [pathname]);

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
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} theme='light'>
          <div className='mt-10'></div>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
          >
            {items.map(item =>
              item.children ? (
                <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {item.children.map(child => (
                    <Menu.Item key={child.key}>
                      {React.isValidElement(child.label) ? (
                        child.label
                      ) : (
                        <span>{child.label}</span>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ) : (
                <Menu.Item key={item.key} icon={item.icon}>
                  {React.isValidElement(item.label) ? (
                    item.label
                  ) : (
                    <span>{item.label}</span>
                  )}
                </Menu.Item>
              )
            )}
          </Menu>
        </Sider>
        <Layout>
          <Content className='ml-4'>
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