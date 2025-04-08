import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Chapter {
  _id: string;
  chaptername: string;
}

const Chapter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subjectName } = location.state || {};  // Only destructure `subjectName` here

  if (!subjectName) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>No subject selected</h2>
        <Link to="/" style={{ color: '#0066cc' }}>
          Go back to select a subject
        </Link>
      </div>
    );
  }

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [newChapterName, setNewChapterName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getChapters();
  }, [subjectName]);

  const getChapters = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/v1/getchapters`, {
        params: {
          subjectType: subjectName.toLowerCase()  // Make sure to pass the correct variable here
        }
      });
      
      if (res.data?.success) {
        setChapters(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching chapters:", err);
      setError("Failed to load chapters");
    } finally {
      setLoading(false);
    }
  };

  const createChapter = async () => {
    if (!newChapterName.trim()) {
      setError("Chapter name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/v1/chapters", {
        chaptername: newChapterName,
        subjectType: subjectName.toLowerCase()  // Ensure the correct value is passed here
      });
      
      if (response.data.success) {
        setNewChapterName("");
        await getChapters(); // Wait for refresh before continuing
      } else {
        setError(response.data.message || "Failed to create chapter");
      }
    } catch (error) {
      console.error("Error creating chapter:", error);
      setError("Failed to create chapter");
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = (chapter: Chapter) => {
    navigate('/Subject', { 
      state: { 
        chapterName: chapter.chaptername,  // Pass the chapter name
        chapterId: chapter._id,
        subjectName: subjectName.toLowerCase()  // Make sure to pass subjectName here
      }
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>CHAPTERS IN SUBJECT: {subjectName.toUpperCase()}</h2>
        <Link 
          to="/" 
          style={{
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            textDecoration: 'none',
            color: '#333'
          }}
        >
          Go back to Subjects
        </Link>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          margin: '10px 0',
          padding: '10px',
          backgroundColor: '#ffebee'
        }}>
          {error}
        </div>
      )}

      <div style={{ margin: '20px 0' }}>
        <h3>Existing Chapters:</h3>
        {loading ? (
          <p>Loading chapters...</p>
        ) : chapters.length === 0 ? (
          <p>No chapters found for this subject</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {chapters.map(chapter => (
              <li 
                key={chapter._id} 
                style={{ 
                  margin: '8px 0',
                  padding: '10px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => handleChapterClick(chapter)}
              >
                {chapter.chaptername}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Add New Chapter:</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            placeholder="Enter chapter name"
            value={newChapterName}
            onChange={(e) => {
              setNewChapterName(e.target.value);
              setError("");
            }}
            style={{ 
              padding: '8px',
              flexGrow: 1,
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button 
            onClick={createChapter}
            disabled={loading}
            style={{ 
              padding: '8px 15px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Adding...' : 'Add Chapter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chapter;
