import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  fetchProducts,
  selectProductById,
  selectProductsError,
  selectProductsStatus,
} from '../features/products/productsSlice'
import { addToCart } from '../features/cart/cartSlice'
import { formatPrice } from '../utils'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectProductsStatus)
  const error = useAppSelector(selectProductsError)
  const product = useAppSelector((state) => selectProductById(state, productId))

  // Mở thẳng URL chi tiết (chưa qua trang chủ) vẫn phải tải được dữ liệu
  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [status, dispatch])

  if (status === 'idle' || status === 'loading') return <p className="notice">Đang tải sản phẩm…</p>

  if (status === 'failed') {
    return (
      <div className="notice notice--error" role="alert">
        <p>{error}</p>
        <button type="button" className="btn" onClick={() => dispatch(fetchProducts())}>
          Thử lại
        </button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="notice">
        <p>Không tìm thấy sản phẩm này.</p>
        <Link to="/" className="btn">
          Về trang chủ
        </Link>
      </div>
    )
  }

  return (
    <article className="detail">
      <div className="detail__image">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="detail__info">
        <Link to="/" className="back-link">
          ← Tất cả sản phẩm
        </Link>
        <p className="card__category">{product.category}</p>
        <h1>{product.title}</h1>
        <p className="price price--lg">{formatPrice(product.price)}</p>
        <p className="detail__desc">{product.description}</p>
        <button type="button" className="btn btn--lg" onClick={() => dispatch(addToCart(product))}>
          Thêm vào giỏ
        </button>
      </div>
    </article>
  )
}
