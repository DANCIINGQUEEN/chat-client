import React, {useState, useEffect} from 'react'
import queryString from 'query-string'
import './Chat.css'
import io from 'socket.io-client'
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

let socket

const Chat = ({location}) => {

    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    const ENDPOINT = 'https://park-react-chat-application.herokuapp.com/'

    useEffect(() => {
        // const data=queryString.parse(location.search)
        //
        // console.log(location.search)
        // console.log(data)

        socket = io(ENDPOINT)

        const {name, room} = queryString.parse(location.search)
        // console.log(name, room)
        setName(name)
        setRoom(room)

        socket.emit('join', {name, room}, ()=>{
            // alert(error)
        })
        // console.log(socket)
        return ()=>{
            socket.emit('disconnect')
            socket.off()
        }
    }, [ENDPOINT, location.search])

    useEffect(()=>{
        socket.on('message', (message)=>{
            setMessages([...messages, message])
        })

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, [])

    const sendMessage=(e)=>{
        e.preventDefault()
        if(message){
            socket.emit('sendMessage', message, ()=>setMessage(''))
        }
    }

    console.log(message, messages)

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                {/*<input*/}
                {/*    value={message}*/}
                {/*    onChange={(e)=>setMessage(e.target.value)}*/}
                {/*    onKeyPress={e=>e.key==='Enter'?sendMessage(e):null}*/}
                {/*/>*/}
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>

            </div>
            <TextContainer users={users}/>
        </div>
    )
}

export default Chat