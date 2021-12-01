/**
 * 环境配置封装
 * 
 */

const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
    dev: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/7da2278e34eb222aefaae7d57f66a51b/api'
    },
    test: {
        baseApi: '//test.future.com/api',
        mockApi: 'https://www.fastmock.site/mock/7da2278e34eb222aefaae7d57f66a51b/api'
    },
    prod: {
        baseApi: '//future.com/api',
        mock: 'https://www.fastmock.site/mock/7da2278e34eb222aefaae7d57f66a51b/api'
    }
}

export default {
    env,
    // mock: true,
    ...EnvConfig[env],
    namespace: 'manage'
}