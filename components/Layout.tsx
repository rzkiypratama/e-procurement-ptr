"use-client"
import React, { useState, useEffect } from 'react';
import {
	Layout, Menu,
	message,
	Spin,
	Flex
} from 'antd';
import {
	UserOutlined,
	TeamOutlined,
	DatabaseOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import ProfileAvatar from '@/lib/ProfileAvatar'
import axios from "axios";
import { getCookie } from 'cookies-next'
import useMenuStore from "@/store/menuStore";
import MenuItem from 'antd/es/menu/MenuItem';

const { Header, Content, Footer, Sider } = Layout;

type Props = {
	children: React.ReactNode;
};

interface ParentMenu {
	menu_name: string;
	urlto: string;
	keterangan: string;
	accessMenu: AccessMenu
	children: ParentMenu[]
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
	const token = getCookie("token")
	const [menuList, setMenuList] = useState<ParentMenu[]>([]);
	// const [items, addMenuItems] = useState<MenuItem[]>([]);
	const [isLoading, setLoading] = useState(false);
	const [collapsed, setCollapsed] = useState(false);

	// useEffect(() => {
	// Initialize data if needed
	// getListMenu()

	// }, []);

	const onCollapse = (collapsed: boolean) => {
		setCollapsed(collapsed);
	};

	// const getListMenu = async () => {
	// 	setLoading(true)
	// 	try {
	// 		const response = await axios.get(`https://vendor.eproc.latansa.sch.id/api/auth/menu`, {
	// 			headers: {
	// 				"Authorization": `Bearer ${token}`
	// 			}
	// 		});
	// 		console.log("Response from API:", response.data);
	// 		if (response.status == 200) {
	// 			return await response.data.data;
	// 			// const data: ParentMenu[] = await response.data.data
	// 			// setMenuList(data)
	// 			// console.log("AAAAA")
	// 			// for (let index = 0; index < data.length; index++) {
	// 			// 	console.log("ASDSAD")
	// 			// 	const element = data[index];
	// 			// 	// if (element.children.length > 0) {

	// 			// 	// }
	// 			// 	items = [
	// 			// 		getItem(<Link href={element.urlto}>AFSD</Link>, `${index}`, <div />)
	// 			// 	]
	// 			// }
	// 			// console.log(items[0].key)
	// 			// console.log(menuList.length)
	// 		} else {
	// 			message.error(`${response.data.message}`);
	// 			return []
	// 		}
	// 	} catch (error) {
	// 		message.error(`Get Menu failed! ${error}`);
	// 		console.error("Error Getting Menu:", error);
	// 	}
	// 	// finally {
	// 	// 	setLoading(false);
	// 	// }
	// }

	// var items: MenuItem[] = []

	// const addItemMenu = () => {
	// 	for (let index = 0; index < menuList.length; index++) {
	// 		const element = menuList[index];
	// 		// if (element.children.length > 0) {

	// 		// }
	// 		const item: MenuItem = getItem(<Link href={element.urlto}>{element.menu_name}</Link>, `${index}`, <div />)
	// 		addMenuItems(items => [...items, item])
	// 	}
	// 	console.log(items)
	// }

	const items: MenuItem[] = [
		getItem(<Link href="/vendor/profile">Company Profile</Link>, '9', <div />),
		getItem(<Link href="https://eproc.delpis.online/admin" target='_blank'>User Management</Link>, '1', <UserOutlined />),
		{
			key: 'sub2',
			icon: <TeamOutlined />,
			label: 'Vendor Management',
			children: [
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

	return (
		<Layout className="h-screen">
			<Header className="bg-blue-500 text-white flex items-center justify-between">
				<div className="text-xl">Delpis</div>
				<ProfileAvatar />
			</Header>
			{isLoading ? <div className="h-96 content-center place-content-center">
				<Flex gap="small" vertical>
					<Spin tip="Loading" size="large" fullscreen={true}><div></div>
					</Spin>
				</Flex>
			</div> : <Layout className='h-max'>
				<Sider collapsible collapsed={collapsed} onCollapse={onCollapse} theme='light'>
					<div className="demo-logo-vertical" />
					<Menu theme="light" defaultSelectedKeys={['0']} mode="inline">
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
						Delpis ©{new Date().getFullYear()}
					</Footer>
				</Layout>
			</Layout>}
		</Layout>
	);
};

export default MyLayout;