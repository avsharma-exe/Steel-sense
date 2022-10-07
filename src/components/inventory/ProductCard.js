// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Reacet Imports
import { useState } from 'react'
import { CardHeader } from '@mui/material'

// ** Custom Components
import CardOptions from 'src/components/inventory/CardOptions'

// ** Helpers
import displayAmount from 'src/helpers/displayAmount'
import useUserDetails from 'src/hooks/useUserDetails'

const ProductCard = ({ product, onEditHandle, onUseStockHandle, onViewStockHandle }) => {
  const userDetails = useUserDetails()
  const [showEdit, setShowEdit] = useState(false)

  return (
    <div>
      <Card sx={{ m: 2 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(4, 5)} !important` }}>
          <CardOptions
            id={product.P_ID}
            onEditHandle={() => onEditHandle(product)}
            onUseStockHandle={() => onUseStockHandle(product)}
            onViewStockHandle={() => onViewStockHandle(product)}
          />

          <Typography variant='h6' sx={{ mb: 2 }}>
            {product && product.PName}
          </Typography>
          <Typography variant='body2'>
            Unit{': '} <Typography sx={{ mb: 2 }}>{product && product.Unit}</Typography>
          </Typography>
          <Typography variant='body2'>
            Purchase price per {product && product.Unit}
            {': '}
            <Typography sx={{ mb: 2 }}>{product && displayAmount(product.PurchasePrice)}</Typography>
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductCard
