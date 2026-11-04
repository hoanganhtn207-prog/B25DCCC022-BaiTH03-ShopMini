import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  clearCart,
  removeFromCart,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from '../features/cart/cartSlice'
import { formatPrice } from '../utils'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const count = useAppSelector(selectCartCount)
  const total = useAppSelector(selectCartTotal)

  if (items.length === 0) {
    return (
      <div className="notice">
        <h1>Giỏ hàng trống</h1>
        <p>Chọn vài sản phẩm để bắt đầu.</p>
        <Link to="/" className="btn">
          Xem sản phẩm
        </Link>
      </div>
    )
  }

  return (
    <section>
      <h1>Giỏ hàng ({count})</h1>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <img src={item.image} alt="" className="cart-item__img" />
            <div className="cart-item__info">
              <Link to={`/products/${item.id}`}>{item.title}</Link>
              <span className="muted">{formatPrice(item.price)}</span>
            </div>
            <div className="qty">
              <button
                type="button"
                className="btn btn--ghost"
                aria-label="Giảm số lượng"
                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
              >
                −
              </button>
              <input
                type="number"
                min={1}
                className="input qty__input"
                value={item.quantity}
                aria-label={`Số lượng ${item.title}`}
                onChange={(e) => {
                  const n = Math.floor(Number(e.target.value))
                  if (Number.isFinite(n) && n > 0) {
                    dispatch(updateQuantity({ id: item.id, quantity: n }))
                  }
                }}
              />
              <button
                type="button"
                className="btn btn--ghost"
                aria-label="Tăng số lượng"
                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
              >
                +
              </button>
            </div>
            <strong className="cart-item__sum">{formatPrice(item.price * item.quantity)}</strong>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => dispatch(removeFromCart(item.id))}
            >
              Xoá
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <button type="button" className="btn btn--ghost" onClick={() => dispatch(clearCart())}>
          Xoá toàn bộ giỏ
        </button>
        <p className="cart-summary__total">
          Tổng tiền: <strong>{formatPrice(total)}</strong>
        </p>
        <Link to="/checkout" className="btn btn--lg">
          Thanh toán
        </Link>
      </div>
    </section>
  )
}
