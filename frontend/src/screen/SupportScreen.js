import React, { useContext, useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';

const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

export default function AdminPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [selectedUser, setSelectedUser] = useState({});
  const [socket, setSocket] = useState(null);
  const uiMessagesRef = useRef(null);
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }

    if (socket) {
      socket.on('message', (data) => {
        if (selectedUser._id === data._id) {
          setMessages([...messages, data]);
        } else {
          const existUser = users.find((user) => user._id === data._id);
          if (existUser) {
            setUsers(
              users.map((user) =>
                user._id === existUser._id ? { ...user, unread: true } : user
              )
            );
          }
        }
      });

      socket.on('updateUser', (updatedUser) => {
        const existUser = users.find((user) => user._id === updatedUser._id);
        if (existUser) {
          setUsers(
            users.map((user) =>
              user._id === existUser._id ? updatedUser : user
            )
          );
        } else {
          setUsers([...users, updatedUser]);
        }
      });
      socket.on('listUsers', (updatedUsers) => {
        setUsers(updatedUsers);
      });

      socket.on('selectUser', (user) => {
        setMessages(user.messages);
      });
    } else {
      const sk = socketIOClient(ENDPOINT);
      setSocket(sk);
      sk.emit('onLogin', {
        _id: userInfo._id,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
      });
    }
  }, [messages, selectedUser, socket, userInfo, users]);

  const selectUser = (user) => {
    setSelectedUser(user);
    const existUser = users.find((x) => x._id === user._id);
    if (existUser) {
      setUsers(
        users.map((x) =>
          x._id === existUser._id ? { ...x, unread: false } : x
        )
      );
    }
    socket.emit('onUserSelected', user);
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
          _id: selectedUser._id,
        });
      }, 1000);

      setMessageBody('');
    }
  };
  return (
    <Row>
      <Col sm={3}>
        {users.filter((x) => x._id !== userInfo._id).length === 0 && (
          <Alert variant="info">No User Found</Alert>
        )}
        <ListGroup>
          {users
            .filter((x) => x._id !== userInfo._id)
            .map((user) => (
              <ListGroup.Item
                action
                key={user._id}
                variant={user._id === selectedUser._id ? 'info' : ''}
                onClick={() => selectUser(user)}
              >
                <Badge
                  bg={
                    selectedUser._id === user._id
                      ? user.online
                        ? 'primary'
                        : 'secondary'
                      : user.unread
                      ? 'danger'
                      : user.online
                      ? 'primary'
                      : 'secondary'
                  }
                >
                  {selectedUser._id === user._id
                    ? user.online
                      ? 'Online'
                      : 'Offline'
                    : user.unread
                    ? 'New'
                    : user.online
                    ? 'Online'
                    : 'Offline'}
                </Badge>
                &nbsp;
                {user.name}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Col>
      <Col sm={9}>
        <div className="admin">
          {!selectedUser.name ? (
            <Alert variant="info">Select a user to start chat</Alert>
          ) : (
            <div>
              <h2>Chat with {selectedUser.name}</h2>
              <ListGroup ref={uiMessagesRef}>
                {messages.length === 0 && (
                  <ListGroup.Item>No message</ListGroup.Item>
                )}
                {messages.map((msg, index) => (
                  <ListGroup.Item key={index}>
                    <strong>{`${msg.name}: `}</strong> {msg.body}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div>
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
              </div>
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
}
