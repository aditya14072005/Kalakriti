import React, { useContext, useState, useMemo, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const Collection = () => {

  const { products } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [currentPage, setCurrentPage] = useState(1)
  const { search, setSearch } = useContext(ShopContext)

  // shuffle once on mount — stable for this visit, different next visit
  const [shuffled, setShuffled] = useState([])
  useEffect(() => {
    if (products.length === 0) return
    const arr = [...products]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    setShuffled(arr)
  }, [products.length]) // only re-shuffle when product count changes (new load)

  const itemsPerPage = 12

  const toggleFilter = (value, setter, state) => {
    setter(state.includes(value) ? state.filter(i => i !== value) : [...state, value])
  }

  const resetFilters = () => {
    setSearch('')
    setCategory([])
    setSubCategory([])
    setSortType('relevant')
    setCurrentPage(1)
  }

  const filterProducts = useMemo(() => {
    let filtered = sortType === 'relevant' ? [...shuffled] : [...products]

    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (category.length) filtered = filtered.filter(p => category.includes(p.category))
    if (subCategory.length) filtered = filtered.filter(p =>
      subCategory.some(s => p.subCategory?.includes(s))
    )

    if (sortType === 'low-high') filtered.sort((a, b) => a.price - b.price)
    else if (sortType === 'high-low') filtered.sort((a, b) => b.price - a.price)

    return filtered
  }, [shuffled, products, category, subCategory, sortType, search])

  // Pagination logic
  const totalPages = Math.ceil(filterProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filterProducts.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [category, subCategory, sortType, search])

  const categories = ['Women', 'Men', 'Kids', 'Home Decor']
  const subCategories = ['Kurtiwear', 'SareeWear', 'EthnicWear', 'WesternWear', 'Accessories', 'Footwear', 'Bottomwear', 'Toys', 'Wall Art', 'Lighting']

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* Filter Sidebar */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)}
          className='my-2 text-xl flex items-center cursor-pointer gap-2 font-medium'>
          FILTERS
          <img className={`h-3 sm:hidden transition-transform ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className='mb-4 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-2'
        >
          <span>🔄</span>
          Reset All Filters
        </button>

        {/* Category */}
        <div className={`border border-gray-300 pl-5 py-3 mt-4 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm text-gray-600'>
            {categories.map(cat => (
              <label key={cat} className='flex gap-2 items-center cursor-pointer'>
                <input type='checkbox' className='w-3'
                  checked={category.includes(cat)}
                  onChange={() => toggleFilter(cat, setCategory, category)} />
                {cat}
              </label>
            ))}
          </div>
        </div>

        {/* SubCategory */}
        <div className={`border border-gray-300 pl-5 py-3 my-4 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm text-gray-600'>
            {subCategories.map(sub => (
              <label key={sub} className='flex gap-2 items-center cursor-pointer'>
                <input type='checkbox' className='w-3'
                  checked={subCategory.includes(sub)}
                  onChange={() => toggleFilter(sub, setSubCategory, subCategory)} />
                {sub}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className='flex-1'>
        <div className='flex justify-between items-center text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          <select onChange={e => setSortType(e.target.value)} value={sortType}
            className='border border-gray-300 text-sm px-2 py-1 rounded'>
            <option value='relevant'>Sort: Relevant</option>
            <option value='low-high'>Price: Low to High</option>
            <option value='high-low'>Price: High to Low</option>
          </select>
        </div>

        <p className='text-sm text-gray-400 mb-4'>{filterProducts.length} products found</p>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {currentProducts.map((item, index) => (
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-2 mt-8 mb-4'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 border rounded-md ${
                  currentPage === page
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Next
            </button>
          </div>
        )}

        {filterProducts.length === 0 && (
          <div className='text-center py-20 text-gray-400'>
            <p className='text-4xl mb-4'>🔍</p>
            <p>No products found. Try adjusting your filters.</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default Collection
