import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  onBulkDelete,
  searchPlaceholder = 'Search...',
}) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState([])
  const itemsPerPage = 10

  const filtered = data.filter((row) =>
    columns.some((col) =>
      String(row[col.key] || '').toLowerCase().includes(search.toLowerCase())
    )
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selected.length === paginated.length) {
      setSelected([])
    } else {
      setSelected(paginated.map((r) => r.id))
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray/50"
          />
        </div>

        {selected.length > 0 && (
          <button
            onClick={() => { onBulkDelete?.(selected); setSelected([]) }}
            className="px-4 py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/20 transition-all duration-300"
          >
            Delete Selected ({selected.length})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-card border border-white/5">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selected.length === paginated.length && paginated.length > 0}
                  onChange={toggleAll}
                  className="rounded border-white/20 bg-transparent"
                />
              </th>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => toggleSelect(row.id)}
                    className="rounded border-white/20 bg-transparent"
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-white">
                    {col.render ? col.render(row[col.key], row) : row[col.key] || <span className="text-gray-600 italic text-xs">—</span>}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(row)}
                      className="p-2 rounded-lg hover:bg-primary/10 text-gray hover:text-primary transition-all duration-300"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray hover:text-red-400 transition-all duration-300"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-12 text-center text-gray">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/5 disabled:opacity-30 hover:bg-white/10 transition-all duration-300"
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/5 disabled:opacity-30 hover:bg-white/10 transition-all duration-300"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
