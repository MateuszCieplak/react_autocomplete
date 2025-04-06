import { useEffect, useState } from 'react';
import { Person } from '../types/Person';

export const Autocomplete: React.FC<{
  people: Person[];
  selectedPerson: Person;
  onSelected(person: Person): () => void;
}> = ({ people, selectedPerson, onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (person: Person) => {
    onSelected(person);
    setInputValue(person.name);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredSuggestions(people);

      return;
    }

    const filtered = people.filter(person =>
      person.name.toLowerCase().includes(inputValue.toLowerCase()),
    );

    setFilteredSuggestions(filtered);
  }, [inputValue, people]);

  useEffect(() => {
    if (
      selectedPerson &&
      inputValue.trim() !== '' &&
      inputValue !== selectedPerson.name
    ) {
      onSelected(null);
    }
  }, [inputValue, selectedPerson, onSelected]);

  return (
    <div className={`dropdown ${showDropdown ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />
      </div>
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {filteredSuggestions.length === 0 ? (
            <div
              className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start
            "
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          ) : (
            filteredSuggestions.map(person => (
              <div
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                {person.name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
