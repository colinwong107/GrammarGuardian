import React, { useState, useEffect } from 'react';
import Loading from './Loading'; // Import the Loading component
import './AIChatbox.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@mui/material/CircularProgress';
function AIChatbox() {

  // State to store the data
  const [data, setData] = useState(null);
  // State to manage loading state
  const [isLoading, setIsLoading] = useState(true);
  // State to manage errors
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    // Detect device width to determine if it's a mobile device
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };
    handleResize(); // Call initially to set the correct state
    window.addEventListener('resize', handleResize); // Add event listener for window resize
    // Asynchronously fetch data from an API
    const fetchData = async () => {
      try {
        const response = await fetch('xxx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    addMessage('bot', 'Hi, I am GrammarGuardian.');
    addMessage('bot', 'If the sentence is grammatically correct, I will respond with "Correct".');
    addMessage('bot', 'Otherwise, I will explain the error and suggest the correct sentence structure.');
    return () => {
      window.removeEventListener('resize', handleResize); // Clean up event listener on component unmount
    };
  }, []);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const handleSend = async () => {
    const thread_id = JSON.parse(data.body)
    console.log(thread_id)
    if (!userInput.trim() ) return;
    //text case
    else{
      setBotTyping(true)
      const messagePayload = {
        thread_id: thread_id,
        user_text_input: userInput.trim()
      };
      addMessage('user', userInput, '');
      setUserInput('');
      await openaiAddMessageAPI(messagePayload)
      const runThreadLoad = {
        thread_id: thread_id,
      };
      const botResponse = await openaiRunThreadAPI(runThreadLoad)
      for (let i = botResponse.length; i > 0; i--) {
        addMessage('bot', botResponse[i - 1]); // Display bot response
      }
      setBotTyping(false)
    }
  };
  const addMessage = (sender, text, image = '') => {
    setMessages((prevMessages) => [...prevMessages, { sender, text, image }]);
  };

  const openaiAddMessageAPI = async (messagePayload) => {
    const response = await fetch('xxx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messagePayload)
    });

    const data = await response.json();
    return data || 'Sorry, I could not process that.';
  };

  const openaiRunThreadAPI = async (messagePayload) => {
    const response = await fetch('xxx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messagePayload),
    });

    const data = await response.json();
    const dataJson = JSON.parse(data.body)
    const msgList = dataJson['msg_list']
    return msgList || 'Sorry, I could not process that.';
  };


  if (isLoading) return <Loading />;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: '#9ce2e2' }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          <div className="center">
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }} color="common.black">
              GrammarGuardian
            </Typography>
          </div>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="App">
        <header className="App-header">
          <div
            id="chatbox"
            style={{ textAlign: 'left', width: isMobile ? 'calc(100% - 56px)' : '1200px', height: '650px', overflow: 'auto', backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '10px' }}
          >
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: '10px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                <div style={{ display: 'inline-block', maxWidth: '700px', padding: '5px', backgroundColor: msg.sender === 'user' ? '#9ce2e2' : '#e9ecef', color: msg.sender === 'user' ? 'white' : 'black', borderRadius: '10px' }}>
                  <Typography variant="body1" component="div" sx={{ flexGrow: 1 }} >
                    {msg.text}
                  </Typography>
                  {msg.image && <img src={msg.image} alt="Uploaded" style={{ display: 'block', maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }} />}
                  {msg.FileReader}
                  {msg.addMessage}
                </div>
              </div>
            ))}
            {botTyping ? <CircularProgress /> : ''}
          </div>
        </header>
        <body className="App-body">
          <Box sx={{ width: isMobile ? '100%' : 1500 }} role="presentation" >
            <TextField
              id="outlined-basic"
              label="Input your sentense"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              variant="outlined"
              style={{ width: isMobile ? 'calc(100% - 90px)' : 1150 }} // Adjust width based on isMobile
            />
            <IconButton
              aria-label="menu"
              onClick={handleSend}
              onKeyDown={e => e.key === 'Enter' ? handleSend :
                ''}
              sx={{ p: 2 }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </body>

      </div>
    </Box>
  );
}

export default AIChatbox;
