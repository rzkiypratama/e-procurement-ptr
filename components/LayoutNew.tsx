import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
	PieChartOutlined,
	DesktopOutlined,
	UserOutlined,
	TeamOutlined,
	FileOutlined,
	DatabaseOutlined
} from '@ant-design/icons';
import Link from 'next/link';

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
		getItem(<Link href="/vendor/profile">Company Profile</Link>, '9', <div />),
		getItem(<Link href="https://eproc.delpis.online/admin">User Management</Link>, '1', <UserOutlined />),
		{
			key: 'sub2',
			icon: <TeamOutlined />,
			label: 'Vendor Management',
			children: [
				getItem(<Link href="/vendor/registration-list">Registration</Link>, '3', <div />),
				getItem(<Link href="/vendor/verification" target='_blank'>Verification</Link>, '4', <div />),
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

	return (
		<Layout className="h-max">
			<Header className="site-layout-background text-white flex items-center justify-between">
				<div className="text-xl">Delpis</div>
			</Header>
			<Layout className='h-max'>
				<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
					<div className="demo-logo-vertical" />
					<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
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
		</Layout>
	);
};

export default MyLayout;