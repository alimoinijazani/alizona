// import React, { useEffect, useRef, useState } from 'react';
// import { FaRocketchat, FaWindowClose } from 'react-icons/fa';

// import socketIOClient from 'socket.io-client';
// import Row from 'react-bootstrap/Row';
// const ENDPOINT =
//   window.location.host.indexOf('localhost') >= 0
//     ? 'http://127.0.0.1:5000'
//     : window.location.host;
// export default function ChatBox(props) {
//   const { userInfo } = props;
//   const [socket, setSocket] = useState(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [messageBody, setMessageBody] = useState('');
//   const [messages, setMessages] = useState([
//     { name: 'Admin', body: 'Hello there,please ask your question' },
//   ]);
//   const uiMessagesRef = useRef(null);
//   useEffect(() => {
//     if (uiMessagesRef.current) {
//       uiMessagesRef.current.scrollBy({
//         top: uiMessagesRef.current.clientHeight,
//         left: 0,
//         behavior: 'smooth',
//       });
//     }
//     if (socket) {
//       socket.emit('onLogin', {
//         _id: userInfo._id,
//         name: userInfo.name,
//         isAdmin: userInfo.isAdmin,
//       });
//       socket.on('message', (data) => {
//         setMessages([...messages, { body: data.body, name: data.name }]);
//       });
//     }
//   }, [messages, socket, userInfo]);
//   const supportHandler = () => {
//     setIsOpen(true);
//     const sk = socketIOClient(ENDPOINT);
//     setSocket(sk);
//   };
//   const submitHandler = (e) => {
//     e.preventDefault();
//     if (!messageBody.trim()) {
//       alert('Error.please type messages.');
//     } else {
//       setMessages([...messages, { body: messageBody, name: userInfo.name }]);
//       setMessageBody('');
//       setTimeout(() => {
//         socket.emit('onMessage', {
//           body: messageBody,
//           name: userInfo.name,
//           isAdmin: userInfo.isAdmin,
//           _id: userInfo._id,
//         });
//       }, 1000);
//     }
//   };
//   const closeHandler = () => {
//     setIsOpen(false);
//   };
//   return (
//     <div className="chatbox">
//       {!isOpen ? (
//         <button type="button" onClick={supportHandler}>
//           <FaRocketchat />
//         </button>
//       ) : (
//         <div className="card card-body">
//           <Row>
//             <strong>Support</strong>
//             <button type="button" onClick={closeHandler}>
//               <FaWindowClose />
//             </button>
//           </Row>
//           <ul ref={uiMessagesRef}>
//             {messages.map((msg, index) => (
//               <li key={index}>
//                 <strong>{`${msg.name}: `}</strong>
//                 {msg.body}
//               </li>
//             ))}
//           </ul>
//           <div>
//             <form onSubmit={submitHandler} className="row">
//               <input
//                 type="text"
//                 value={messageBody}
//                 onChange={(e) => setMessageBody(e.target.value)}
//                 placeholder="type message"
//               />
//               <button type="submit">Send</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useContext, useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { FaRocketchat } from 'react-icons/fa';
import { Store } from './../Store';

const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

export default function ChatBox() {
  const uiMessagesRef = useRef(null);
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [messages, setMessages] = useState([
    { name: 'System', body: 'Hello there, Please ask your question.' },
  ]);

  const [socket, setSocket] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messageBody, setMessageBody] = useState('');

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
    if (socket) {
      socket.emit('onLogin', {
        _id: userInfo._id,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
      });

      socket.on('message', (data) => {
        setMessages([...messages, data]);
      });
    }
  }, [messages, socket, userInfo]);

  const supportHandler = () => {
    setIsOpen(true);

    const sk = socketIOClient(ENDPOINT);
    setSocket(sk);
  };
  const closeHandler = () => {
    setIsOpen(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert('Error. Please type message.');
    } else {
      setMessages([...messages, { body: messageBody, name: userInfo.name }]);

      setTimeout(() => {
        socket.emit('onMessage', {
          body: messageBody,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
          _id: userInfo._id,
        });
      }, 1000);
      setMessageBody('');
    }
  };

  return (
    <div className="chatbox">
      {!isOpen ? (
        <Button onClick={supportHandler} variant="primary">
          <FaRocketchat />
        </Button>
      ) : (
        <Card>
          <Card.Body>
            <Row>
              <Col>
                <strong>Support</strong>
              </Col>
              <Col className="text-end">
                <Button
                  className="btn-sm btn-secondary"
                  type="button"
                  onClick={closeHandler}
                >
                  x
                </Button>
              </Col>
            </Row>
            <hr />
            <ListGroup ref={uiMessagesRef}>
              {messages.map((msg, index) => (
                <ListGroup.Item key={index}>
                  <strong>{`${msg.name}: `}</strong> {msg.body}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <form onSubmit={submitHandler}>
              <InputGroup className="col-6">
                <FormControl
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  type="text"
                  placeholder="type message"
                ></FormControl>
                <Button type="submit" variant="primary">
                  Send
                </Button>
              </InputGroup>
            </form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
