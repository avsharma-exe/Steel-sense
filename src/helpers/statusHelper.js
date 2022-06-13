const statusMap = {
    '0': 'Draft',
    '50': 'Active',
    '99': 'Inactive'
}

export const getStatusText = (status) => {
    let statusText = '';
    Object.entries(statusMap).forEach(item => {
        if(item[0] == status) statusText = item[1]
    })
    return statusText
}