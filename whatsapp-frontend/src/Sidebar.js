import React from 'react';
import "./Sidebar.css";
import ChatIcon from '@material-ui/icons/Chat';
import { Avatar, IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from './SidebarChat';
import { useStateValue } from './StateProvider';

function Sidebar({messages}) {
    const [{user},dispatch] = useStateValue()
    return (
        <div className='sidebar'>
            <div className="sidebar__header">
            <IconButton>
                    <Avatar src={user.photoURL}/>
                    </IconButton>
                <div className="sidebar__headerRight">
                    
                    <IconButton>
                    <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
            <SearchOutlined />
            <input placeholder="Search or start new chat" type="text" />
            </div>
            </div>
            <div className="sidebar__chats">
                <SidebarChat messages={messages} />
            </div>
            
        </div>
    )
}

export default Sidebar
