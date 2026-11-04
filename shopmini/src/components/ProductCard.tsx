import { Link } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { addToCart } from '../features/cart/cartSlice'
import type { Product } from '../types'
import { formatPrice } from '../utils'

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch()

  return (
    <article className="card">
      <Link to={`/products/${product.id}`} className="card__image" aria-label={product.title}>
        <img src={product.image} alt={product.title} loading="lazy" />
      </Link>
      <div className="card__body">
        <p className="card__category">{product.category}</p>
        <h3 className="card__title">
          <Link to={`/products/${product.id}`}>{product.title}</Link>
        </h3>
        <div className="card__footer">
          <strong className="price">{formatPrice(product.price)}</strong>
          <button type="button" className="btn" onClick={() => dispatch(addToCart(product))}>
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </article>
  )
}
