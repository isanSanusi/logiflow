import {
  mdiSquareEditOutline,
  mdiTelevisionGuide,
  mdiAccountCircle,
  mdiViewList,
  mdiPenPlus,
  mdiMonitor,
  mdiTable,
  mdiHistory,
  mdiAccount,
  mdiInboxFull,
  mdiSend,
  mdiViewAgenda,
  mdiArchive
} from '@mdi/js'

export default [
  {
    to: '/companies',
    label: 'Companies',
    icon: mdiTable,
    allowedRole: ['developer']
  },
  {
    to: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
    allowedRole: ['developer', 'SUPER_ADMIN', 'ADMIN', 'USER']
  },
  {
    to: '/users',
    label: 'Users',
    icon: mdiAccount,
    allowedRole: ['SUPER_ADMIN', 'ADMIN']
  },
  
  {
    to: '/inbox',
    label: 'Order',
    icon: mdiInboxFull,
    allowedRole: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    label: 'History',
    icon: mdiHistory,
    allowedRole: ['SUPER_ADMIN', 'ADMIN']
  },
  {
    label: 'Archives',
    icon: mdiArchive,
    allowedRole: ['SUPER_ADMIN', 'ADMIN']
  },

  {
    to: '/review',
    label: 'Review',
    icon: mdiViewAgenda,
    allowedRole: ['USER']
  },
  {
    to: "/sent",
    label: 'Sent',
    icon: mdiSend,
    allowedRole: ['USER']
  },
  {
    to: '/input',
    label: 'Input',
    icon: mdiPenPlus,
    allowedRole: ['USER']
  },
  {
    label: 'Sub Menus',
    icon: mdiViewList,
    allowedRole: ['developer', 'SUPER_ADMIN', 'ADMIN', 'USER'],
    menu: [
      {
        to: '/profile',
        label: 'Profile',
        icon: mdiAccountCircle,
      },
      {
        to: '/ui',
        label: 'UI',
        icon: mdiTelevisionGuide,
      },
      {
        to: '/forms',
        label: 'Forms',
        icon: mdiSquareEditOutline,
      },
    ],
  },
]
