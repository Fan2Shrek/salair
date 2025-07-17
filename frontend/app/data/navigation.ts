export interface NavLink {
  title: string
  link: string
  icon: string
  translationKey?: string
}

export const navigationConfig = {
  home: {
    title: 'sidebar.home',
    link: '/',
    icon: 'home',
    translationKey: 'sidebar.home'
  },
  
  client: [
    {
      title: 'sidebar.dashboard',
      link: '/app/dashboard',
      icon: 'chart',
      translationKey: 'sidebar.dashboard'
    },
    {
      title: 'sidebar.invoices',
      link: '/app/invoices',
      icon: 'file-lines',
      translationKey: 'sidebar.invoices'
    },
    {
      title: 'sidebar.customers',
      link: '/app/customers',
      icon: 'users',
      translationKey: 'sidebar.customers'
    },
    {
      title: 'sidebar.company',
      link: '/app/company',
      icon: 'building',
      translationKey: 'sidebar.company'
    }
  ],
  
  admin: [
    {
      title: 'sidebar.admin.dashboard',
      link: '/admin/dashboard',
      icon: 'chart',
      translationKey: 'sidebar.admin.dashboard'
    },
    {
      title: 'sidebar.admin.articles',
      link: '/admin/articles',
      icon: 'file',
      translationKey: 'sidebar.admin.articles'
    },
    {
      title: 'sidebar.admin.users',
      link: '/admin/users',
      icon: 'user',
      translationKey: 'sidebar.admin.users'
    },
    {
      title: 'sidebar.admin.companies',
      link: '/admin/companies',
      icon: 'building',
      translationKey: 'sidebar.admin.companies'
    }
  ]
} as const
