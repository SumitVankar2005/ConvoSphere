import { Server } from 'socket.io';

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
    const io = new Server(server,{
        cors:{
            origin: "*",//allowing everthing -> we dont do in production level
            methods:["GET","POST"],
            allowedHeaders:['*'],
            credentials: true
        }
    });//cors origin error

    io.on('connection', (socket) => {
        socket.on('join-call', (path) => {
            if (connections[path] === undifined) {
                connections[path] = [];
            }
            connections[path].push(socket.id);

            timeOnline[socket.id] = new Date();

            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit('user-joined', socket.id, connections[path]);
            }

            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; a++) {
                    io.to(socket.id).emit(
                        'chat-message',
                        messages[path][a]['data'],
                        messages[path][a]['sender'],
                        messages[path][a]['socket-id-sender']
                    );
                }
            }
        });

        socket.on('signal', (toId, messag) => {
            io.to(toId).emit('signal', socket.id, message);
        });

        socket.on('chat-message', (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections).reduce(
                ([room, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.include(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];
                },
                ['', false]
            );

            if (found === true) {
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({'sender':sender,'data':data, 'socket-id-sender':socket.id});
                console.log("message",key,":",sender,data);

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message",data,sender,socket.id);
                })
            }
        });

        socket.on('disonnect', () => {

            var diffTime = Math.abs(timeOnline[socket.id] - new Date())
            
            var key

            for(const [k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))){//k -> room and v->persons

                for(let a = 0; a < v.length; a++){//a -> user socket id
                    if(v[a] === socket.id){
                        key = k; // room

                        for(let i = 0; i < connections[key].length; i++){
                            io.to(connections[key][i]).emit("user-left",socket.id); //instructing that user is disconnected
                        }

                        var index = connections[key].indexOf(socket.id);

                        connections[key].splice(index,1);//deleting user actually -> deep copy

                        if(connections[key].length === 0){
                            delete connections[key];//whole room object deleted here
                        }
                    }
                }
            }
        });
    });

    return io;
};
