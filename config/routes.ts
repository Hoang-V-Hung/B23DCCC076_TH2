import component from "@/locales/en-US/component";
import Icon from "@ant-design/icons";
import { icons } from "antd/lib/image/PreviewGroup";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todolist',
		name: 'Todolist',
		component: './Todolist',
		icon: 'FormOutlined',
	},
	{
		path: '/game',
		name: 'Game',
		component: './Game',
		icon: 'PlayCircleOutlined',
	},
	{
		path: '/app',
		name: 'App',
		icon: 'AppstoreOutlined',
		routes: [
			{
				path: 'quanlydanhmucmonhoc',
				name: 'Quản lý danh mục môn học',
				// exact: true,
				component: './App/quanlydanhmucmonhoc/quanlydanhmucmonhoc',
			},
			{
				path: 'quanlytiendohoctap',
				name: 'Quản lý tiến độ học tập',
				// exact: true,
				component: './App/quanlytiendohoctap/quanlytiendohoctap',
			},
			{
				path: 'thietlapmuctieuhoctap',
				name: 'Thiết lập mục tiêu học tập',
				// exact: true,
				component: './App/thietlapmuctieuhoctap/thietlapmuctieuhoctap',
			},
		],
	},
	{
		path: '/rps',
		name: 'Rock Paper Scissors',
		component: './RockPaperScissors',
		icon:'RocketOutlined'
	},
	{
		path: '/nganHangCauHoi',
		name: 'Ngan hang cau hoi',
		
		routes: [
			{
				path: './qlMonHoc1',
				name: 'Quản lý môn học',
				component: './qlMonHoc1',
			},
			{
				path: './qlCauHoi',
				name:'Câu hỏi',
				component:'./qlCauhoi',
				
			},
			{
				path: './qlDeThi',
				name:'De thi',
				component:'./dethi',
				
			},
		],
		
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
