// 将身份转化为中文显示
export function parseRole(role: string | null) {
    if (role === 'CUSTOMER') {
        return '顾客';
    } else if (role === 'MANAGER') {
        return '管理员';
    }
}