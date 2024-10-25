import React from 'react';
import '../../styles/dashboard/pagination.css'

export const Pagination = ({ subsPerPage, totalSubs, paginate, currentPage, setSubsPerPage }) => {
    let totalPages = Math.ceil(totalSubs / subsPerPage);
    
      const handlePrev = () => {
        if (currentPage > 1) {
          paginate(currentPage - 1);
        }
      };
    
      const handleNext = () => {
        if (currentPage < totalPages) {
          paginate(currentPage + 1);
        }
      };

      if (totalPages < 1) {
        totalPages = 1;
      }

      if (currentPage < 1) {
        paginate(1);
      }

      if (currentPage > totalPages) {
        paginate(totalPages);
      }

    return (
        <nav className="pagination-container">
            <ul className="pagination">
                <li>
                    <button onClick={handlePrev} disabled={currentPage === 1}>
                        &laquo; Prev
                    </button>
                </li>
                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <li>
                    <button onClick={handleNext} disabled={currentPage === totalPages}>
                        Next &raquo;
                    </button>
                </li>
            </ul>
            <div className="subs-per-page-container">
                <label>Subs per page:
                <select
                    value={subsPerPage}
                    onChange={(e) => setSubsPerPage(Number(e.target.value))}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                </label>
            </div>
        </nav>
    );
};
