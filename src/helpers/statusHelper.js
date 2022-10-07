import CustomChip from 'src/@core/components/mui/chip'


const statusMap = {
  0: <CustomChip size='small' skin='light' color='primary' label='Draft' />,
  50: <CustomChip size='small' skin='light' color='success' label='Active' />,
  99: <CustomChip size='small' skin='light' color='warning' label='In Active' />
}

const indentStatus = {
  0: <CustomChip size='small' skin='light' color='warning' label='Under Approval' />,
  50: <CustomChip size='small' skin='light' color='success' label='Approved' />,
  99: <CustomChip size='small' skin='light' color='primary' label='Ordered' />,
}

export const getStatusText = status => {
  return statusMap[status]
}

export const getIndentStatusText = status => {
  return indentStatus[status]
}
