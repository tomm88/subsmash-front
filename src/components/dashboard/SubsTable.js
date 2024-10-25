import React, { useState } from "react";
import { reRollCharacter } from "../../httpRequests/reRollCharacter"
import { useGetTwitchSubs } from "../../hooks/useGetTwitchSubs";
import { Pagination } from "./Pagination";
import { SearchBar } from "./SearchBar";
import {ReactComponent as NewTabIcon} from '../../assets/icons/newtab.svg'
import '../../styles/dashboard/subsTable.css'

export const SubsTable = () => {

  const [loadingStates, setLoadingStates] = useState({});
  const [showInactive, setShowInactive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [subsPerPage, setSubsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })

  const { allSubscribers, activeSubscribers, getSubscribers, pageLoading } = useGetTwitchSubs();

  const indexOfLastSub = currentPage * subsPerPage;
  const indexOfFirstSub = indexOfLastSub - subsPerPage;

  let subsInTable;
  if (showInactive) {
    subsInTable = allSubscribers;
  } else {
    subsInTable = activeSubscribers;
  }

  const filteredSubscribers = subsInTable.filter(sub => 
    sub.subscriberTwitchUsername.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
    sub.characterName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let sortedSubscribers = filteredSubscribers;
  if (sortConfig.key !== ''){
    sortedSubscribers = [...filteredSubscribers].sort((a, b) => {
      if (a[sortConfig.key].toLowerCase() < b[sortConfig.key].toLowerCase()) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key].toLowerCase() > b[sortConfig.key].toLowerCase()) {
        return sortConfig.direction === 'asc' ? 1: -1;
      }
      return 0
    })
  }

  const displayedSubscribers = sortedSubscribers.slice(indexOfFirstSub, indexOfLastSub);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRerollClick = async (username) => {
    setLoadingStates(prevState => ({ ...prevState, [username]: true }));
    try {
      await reRollCharacter(username);
      await getSubscribers();
    } catch(err) {
      console.error(err, "error re-rolling the character")
    } finally {
      setLoadingStates(prevState => ({ ...prevState, [username]: false }))
    }
  }

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction })
  }

  if (pageLoading) {
    return <div>Loading...</div>
  }

  if (allSubscribers.length === 0 && !pageLoading) {
    return <div>Looks like you don't have any subscribers...yet!</div>
  }

    const handleCheckBoxChange = () => {
      setShowInactive(!showInactive);
    }

  return (
    <div className="subs-table-container">
      <div className="table-options">
        <div className="table-heading">
          <h2>Subscribers</h2>
          <label>
              <input 
              type="checkbox" 
              checked={showInactive} 
              onChange={handleCheckBoxChange} 
              />
              Show Expired Subs
          </label>
        </div>
        <div className="pagination">
          <Pagination
            subsPerPage={subsPerPage}
            totalSubs={filteredSubscribers.length}
            paginate={paginate}
            currentPage={currentPage}
            setSubsPerPage={setSubsPerPage}
        />
        </div>
        <div className="search-bar">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>
      <div>
        <table>
          <thead>
              <tr>
                  <th className="sort-link" onClick={() => handleSort('subscriberTwitchUsername')}>Username</th>
                  <th className="sort-link" onClick={() => handleSort('subscriptionTier')}>Tier</th>
                  <th className="sort-link" onClick={() => handleSort('characterName')}>Character Name</th>
                  <th>Prompt</th>
                  <th>View Character</th>
                  {showInactive && <th>Active</th>}
              </tr>
          </thead>
          <tbody>
              {displayedSubscribers.map(sub => (
                  <tr key={sub.id}>
                      <td>{sub.subscriberTwitchUsername}</td>
                      <td>{parseInt(sub.subscriptionTier)/1000}</td>
                      <td>{sub.characterName}</td>
                      <td>{sub.userPrompt}</td>
                      <td className="view-image-column">
                          <button onClick={() => window.open(`${sub.imageUrl}`, '_blank')}
                            disabled={sub.characterName === "No character name"}
                            >
                              View Image <NewTabIcon style={{ width: '14px', height: '14px'}} />
                          </button>
                      </td>
                      {showInactive && <td>{sub.active ? 'Yes' : 'No'}</td>}
                      <td>
                          <button onClick={() => handleRerollClick(sub.subscriberTwitchUsername)}
                            disabled={loadingStates[sub.subscriberTwitchUsername]}
                            >
                              {loadingStates[sub.subscriberTwitchUsername] 
                              ? (sub.characterName === "No character name" ? "Generating..." : "Re-rolling...") 
                              : (sub.characterName === "No character name" ? "Generate Character" : "Re-roll Character")
                              }
                              </button>
                      </td>
                  </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};