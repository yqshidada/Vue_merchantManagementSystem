export const routes = [
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },

  {
    path: '/',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: '/home',
        alias: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: '/typeList',
        name: 'TypeList',
        component: () => import('../views/TypeList.vue')
      },
      {
        path: '/createType',
        name: 'CreateType',
        component: () => import('../views/CreateType.vue')
      },
      {
        path: '/productList',
        name: 'ProductList',
        component: () => import('../views/ProductList.vue')
      },
      {
        path: '/postProduct',
        name: 'PostProduct',
        component: () => import('../views/PostProduct.vue')
      }
    ]
  }
]