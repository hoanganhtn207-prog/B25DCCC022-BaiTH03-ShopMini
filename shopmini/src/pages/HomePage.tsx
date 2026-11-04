import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from '../features/products/productsSlice'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectProducts)
  const status = useAppSelector(selectProductsStatus)
  const error = useAppSelector(selectProductsError)
  const [query, setQuery] = useState('') // state cục bộ: chỉ trang này cần

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [status, dispatch])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? products.filter((p) => p.title.toLowerCase().includes(q)) : products
  }, [products, query])

  return (
    <section>
      <div className="toolbar">
        <h1>Sản phẩm</h1>
        <input
          type="search"
          className="input toolbar__search"
          placeholder="Tìm theo tên sản phẩm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Tìm sản phẩm theo tên"
        />
      </div>

      {(status === 'idle' || status === 'loading') && <p className="notice">Đang tải sản phẩm…</p>}

      {status === 'failed' && (
        <div className="notice notice--error" role="alert">
          <p>{error}</p>
          <button type="button" className="btn" onClick={() => dispatch(fetchProducts())}>
            Thử lại
          </button>
        </div>
      )}

      {status === 'succeeded' &&
        (filtered.length === 0 ? (
          <p className="notice">Không có sản phẩm nào khớp với “{query}”.</p>
        ) : (
          <div className="grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ))}
    </section>
  )
}
