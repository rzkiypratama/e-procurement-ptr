import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

type Props = {
  children: React.ReactNode;
};

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
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const items: MenuItem[] = [
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    {
      key: 'sub1',
      icon: <UserOutlined />,
      label: 'User',
      children: [
        getItem('Tom', '3', <UserOutlined />),
        getItem('Bill', '4', <UserOutlined />),
        {
          key: 'sub1-3',
          label: 'Alex',
          icon: <UserOutlined />,
          children: [
            getItem('Submenu 1', '7', <UserOutlined />),
            getItem('Submenu 2', '8', <UserOutlined />),
          ],
        },
      ],
    },
    {
      key: 'sub2',
      icon: <TeamOutlined />,
      label: 'Team',
      children: [
        getItem('Team 1', '6', <TeamOutlined />),
        getItem('Team 2', '8', <TeamOutlined />),
      ],
    },
    getItem('Files', '9', <FileOutlined />),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="demo-logo-vertical" />
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
          {items.map((item) =>
            item.children ? (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map((child) => (
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
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MyLayout;