import React, { useContext } from 'react';
import { Store } from '../Store';
import ChatBox from './../components/ChatBox';

export default function FooterScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return (
    <footer className="footer">
      {userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo} />}
      <div className="text-center">All Right Reserved</div>
    </footer>
  );
}
