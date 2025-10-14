import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5005';

export default function App() {
  const [results, setResults] = useState({A:0,B:0});
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/results`);
      setResults(res.data);
    } catch(err){ console.error(err); }
  };

  useEffect(() => {
    fetchResults();
    const id = setInterval(fetchResults, 3000);
    return () => clearInterval(id);
  }, []);

  const vote = async (option) => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/api/vote`, { option });
      await fetchResults();
    } catch(err){ console.error(err); } finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: 'Arial', textAlign:'center', padding:40 }}>
      <h1>Voting App</h1>
      <div style={{ margin:20 }}>
        <button onClick={()=>vote('A')} disabled={loading} style={{padding: '10px 20px', marginRight:10}}>Vote A</button>
        <button onClick={()=>vote('B')} disabled={loading} style={{padding: '10px 20px'}}>Vote B</button>
      </div>
      <h2>Live Results</h2>
      <div style={{ fontSize: 20 }}>
        <div>Option A: {results.A}</div>
        <div>Option B: {results.B}</div>
      </div>
      <div style={{ marginTop: 20, color:'#777' }}>Updates every 3s</div>
    </div>
  );
}
