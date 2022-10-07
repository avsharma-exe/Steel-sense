import CustomAvatar from 'src/@core/components/mui/avatar'

const getInitials = string => string.split(/\s/).reduce((response, word) => (response += word.slice(0, 1)), '')

export const displayInitials = name => {
  return (
    <CustomAvatar skin='light' color={'primary'} sx={{ mr: 3, fontSize: '1rem', width: 34, height: 34 }}>
      {getInitials(name || 'Not Available')}
    </CustomAvatar>
  )
}
