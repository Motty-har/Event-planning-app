import { io } from 'socket.io-client';

const socket = io('http://localhost:5555'); // Replace with your server's URL

export default socket;
