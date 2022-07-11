const statusMap = {
  0: 'Draft',
  50: 'Active',
  99: 'Inactive'
}

const indentStatusMap = {
  0: 'Under Approval',
  50: 'Approved',
  99: 'Ordered'
}

export const getStatusText = status => {
  let statusText = ''
  Object.entries(statusMap).forEach(item => {
    if (item[0] == status) statusText = item[1]
  })
  return statusText
}

export const getIndentStatusText = status => {
  let statusText = ''
  Object.entries(indentStatusMap).forEach(item => {
    if (item[0] == status) statusText = item[1]
  })
  return statusText
}
