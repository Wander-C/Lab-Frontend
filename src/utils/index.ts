// 将身份转化为中文显示
export function parseRole(role: string | null) {
    if (role === 'user') {
        return '顾客';
    } else if (role === 'admin') {
        return '管理员';
    }
}