import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { LoadStatus, Product } from '../../types'

export interface ProductsState {
  items: Product[]
  status: LoadStatus
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
}

const API_URL = 'https://fakestoreapi.com/products'

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { state: { products: ProductsState }; rejectValue: string }
>(
  'products/fetchProducts',
  async (_arg, { rejectWithValue }) => {
    try {
      const res = await fetch(API_URL)
      if (!res.ok) {
        return rejectWithValue(`Máy chủ trả về lỗi ${res.status}`)
      }
      return (await res.json()) as Product[]
    } catch {
      return rejectWithValue('Không thể kết nối tới máy chủ. Kiểm tra mạng và thử lại.')
    }
  },
  {
    // Tránh gọi API trùng khi đang tải hoặc đã tải xong
    condition: (_arg, { getState }) => {
      const { status } = getState().products
      return status !== 'loading' && status !== 'succeeded'
    },
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Đã có lỗi xảy ra'
      })
  },
})

export default productsSlice.reducer

export const selectProducts = (state: { products: ProductsState }) => state.products.items
export const selectProductsStatus = (state: { products: ProductsState }) => state.products.status
export const selectProductsError = (state: { products: ProductsState }) => state.products.error
export const selectProductById = (state: { products: ProductsState }, id: number) =>
  state.products.items.find((p) => p.id === id)
