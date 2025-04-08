import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import InputField from "../components/InputField";
import axios from "axios";
interface NoteItem {
  id: number;
  name: string;
  type: 'formula' | 'note';
}

const Notes = () => {
  const location = useLocation();
  const { subjectName, subjectType } = location.state || {};
  
  if (!subjectName || !subjectType) {
    return (
      <div>
        No subject has been selected
        <Link to="/subject">Select subject</Link>
      </div>
    );
  }

  const [items, setItems] = useState<NoteItem[]>([]);
  const [nextId, setNextId] = useState(0);

  const addItem = (type: 'formula' | 'note') => {
    setItems([
      ...items,
      {
        id: nextId,
        name: "",
        type
      }
    ]);
    setNextId(nextId + 1);
  };

  const updateItem = (id: number, name: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, name } : item
      )
    );
  };

  const submitItem = async (id: number) => {
  const item = items.find(item => item.id === id);
  
  if (!item || !item.name.trim()) {
    alert(`${item?.type === 'formula' ? 'Formula' : 'Note'} cannot be empty`);
    return;
  }

  try {
    // Choose the correct endpoint based on your backend routes
    let endpoint, body;
    
    if (item.type === 'formula') {
      endpoint = `http://localhost:3000/api/v1/chapters/${encodeURIComponent(subjectName)}/subjects/${encodeURIComponent(item.name)}/notes`;
      body = {
        formula: item.name,
        notes: "", // You might want to add notes field too
        subjectType: subjectType.toLowerCase()
      };
    } else {
      endpoint = `http://localhost:3000/api/v1/chapters/${encodeURIComponent(subjectName)}/subjects/${encodeURIComponent(item.name)}/notes`;
      body = {
        notes: item.name,
        subjectType: subjectType.toLowerCase()
      };
    }

    const response = await axios.post(endpoint, body);
    
    if (response.data.success) {
      alert(`${item.type === 'formula' ? 'Formula' : 'Note'} created successfully`);
      setItems(items.filter(i => i.id !== id));
    }
  } catch (error) {
    console.error(`Error creating ${item?.type}:`, error);
    alert(error|| `Failed to create ${item?.type}`);
  }
};

  return (
    <div>
      <h2>Notes for {subjectName} ({subjectType})</h2>
      <Link to="/subject">Back to Subjects</Link>
      
      <div>
        <button onClick={() => addItem('formula')}>Add Formula</button>
        <button onClick={() => addItem('note')}>Add Note</button>
        
        {items.map((item) => (
          <InputField
            key={item.id}
            id={item.id}
            value={item.name}
            placeholder={`Enter ${item.type} name`}
            onChange={updateItem}
            onSubmit={submitItem}
          />
        ))}
      </div>
    </div>
  );
};

export default Notes;