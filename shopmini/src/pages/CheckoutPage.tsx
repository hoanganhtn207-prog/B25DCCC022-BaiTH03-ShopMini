import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { clearCart, selectCartItems, selectCartTotal } from '../features/cart/cartSlice'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice } from '../utils'

export default function CheckoutPage() {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const [ordered, setOrdered] = useState(false) // state cục bộ: chỉ trang này cần

  const handleOrder = () => {
    dispatch(clearCart())
    setOrdered(true)
  }

  if (ordered) {
    return (
      <div className="notice notice--success" role="status">
        <h1>Đặt hàng thành công</h1>
        <p>Cảm ơn {user?.username}! Đơn hàng của bạn đã được ghi nhận.</p>
        <Link to="/" className="btn">
          Tiếp tục mua sắm
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="notice">
        <h1>Chưa có gì để thanh toán</h1>
        <Link to="/" className="btn">
          Xem sản phẩm
        </Link>
      </div>
    )
  }

  return (
    <section>
      <h1>Thanh toán</h1>
      <p className="muted">Người đặt: {user?.username}</p>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="checkout-row">
            <span>
              {item.title} × {item.quantity}
            </span>
            <strong>{formatPrice(item.price * item.quantity)}</strong>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <p className="cart-summary__total">
          Tổng tiền: <strong>{formatPrice(total)}</strong>
        </p>
        <button type="button" className="btn btn--lg" onClick={handleOrder}>
          Đặt hàng
        </button>
      </div>
    </section>
  )
}
