import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

interface Subject {
  _id: string;
  nameofsubject: string;
}

interface SubjectInput {
  id: number;
  nameofsubject: string;
}

type ValidSubjectType = 'physics' | 'chemistry' | 'math';

const Subject = () => {
  const location = useLocation();
  const { chapterName, chapterId, subjectType } = location.state || {};
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectInputs, setSubjectInputs] = useState<SubjectInput[]>([]);
  const [nextId, setNextId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // Fetch subjects when component mounts or chapterId changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!chapterId || !subjectType) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/v1/chapters/${chapterId}/getsubjects`,
          {
            params: { subjectType }
          }
        );
        
        if (response.data?.success) {
          setSubjects(response.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setError("Failed to load subjects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [chapterId, subjectType]);
const isValidSubjectType = (type: any): type is ValidSubjectType => {
  return typeof type === 'string' && ['physics', 'chemistry', 'math'].includes(type.toLowerCase());
};

// Then in your validation check:
if (!chapterName || !chapterId || !subjectType) {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Missing required information</h2>
      <p style={{ color: '#d32f2f', margin: '10px 0' }}>
        {!subjectType ? "Subject type not provided" : 
         !chapterId ? "Chapter ID not provided" : "Chapter name not provided"}
      </p>
      <Link to="/chapter" style={{ color: '#0066cc' }}>
        Go back to select a chapter
      </Link>
    </div>
  );
}

if (!isValidSubjectType(subjectType)) {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Invalid Subject Type</h2>
      <p style={{ color: '#d32f2f', margin: '10px 0' }}>
        Received: "{subjectType}" (must be one of: physics, chemistry, math)
      </p>
      <Link to="/chapter" style={{ color: '#0066cc' }}>
        Go back to select a chapter
      </Link>
    </div>
  );
}

  const addSubjectInput = () => {
    setSubjectInputs([
      ...subjectInputs,
      { id: nextId, nameofsubject: "" }
    ]);
    setNextId(nextId + 1);
    setError("");
  };

  const updateSubjectName = (id: number, name: string) => {
    setSubjectInputs(subjectInputs.map(input =>
      input.id === id ? { ...input, nameofsubject: name } : input
    ));
  };

  const createSubject = async (id: number) => {
    const subjectInput = subjectInputs.find(input => input.id === id);
    
    if (!subjectInput?.nameofsubject.trim()) {
      setError("Subject name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/chapters/${chapterId}/subjects`,
        {
          nameofsubject: subjectInput.nameofsubject.trim(),
          subjectType
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data?.success) {
        // Update subjects list and remove the input
        setSubjects(prev => [...prev, response.data.subject]);
        setSubjectInputs(prev => prev.filter(input => input.id !== id));
      } else {
        setError(response.data?.message || "Failed to create subject");
      }
    } catch (error) {
      console.error("Error creating subject:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to create subject");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>Subjects in Chapter: {chapterName} ({subjectType})</h2>
        <Link 
          to="/chapter" 
          state={{ subjectType }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            textDecoration: 'none',
            color: '#333',
            fontWeight: '500'
          }}
        >
          Back to Chapters
        </Link>
      </div>
      
      {loading && subjects.length === 0 ? (
        <p>Loading subjects...</p>
      ) : subjects.length > 0 ? (
        <div style={{ marginBottom: '30px' }}>
          <h3>Existing Subjects:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {subjects.map(subject => (
              <li key={subject._id} style={{ 
                padding: '10px',
                margin: '5px 0',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px'
              }}>
                {subject.nameofsubject}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No subjects found for this chapter</p>
      )}

      {error && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#ffebee',
          color: '#d32f2f',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={addSubjectInput}
          disabled={loading}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            opacity: loading ? 0.7 : 1
          }}
        >
          Add New Subject
        </button>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px'
        }}>
          {subjectInputs.map((input) => (
            <div 
              key={input.id} 
              style={{ 
                display: 'flex', 
                gap: '10px',
                alignItems: 'center'
              }}
            >
              <input
                type="text"
                placeholder="Enter subject name"
                value={input.nameofsubject}
                onChange={(e) => updateSubjectName(input.id, e.target.value)}
                disabled={loading}
                style={{ 
                  padding: '10px',
                  flexGrow: 1,
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
              <button 
                onClick={() => createSubject(input.id)}
                disabled={loading || !input.nameofsubject.trim()}
                style={{ 
                  padding: '10px 20px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  opacity: (loading || !input.nameofsubject.trim()) ? 0.7 : 1
                }}
              >
                Submit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subject;