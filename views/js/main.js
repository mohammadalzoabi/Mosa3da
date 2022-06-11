const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const userList = document.getElementById('users')
const otherSideName = document.getElementById('otherSideName')
const message = document.getElementById('msg')
const feedback = document.getElementById('feedback')


// Get Usernames
const {patient, therapist, room} = Qs.parse(location.search, {
})

console.log(patient, therapist, room);

const socket = io()


// Join Chatroom
socket.emit('joinRoom', {patient, room})

//Get Room and Other User Name
socket.on('roomUsers', ({room, users}) => {
    outputUsers(users, therapist);
})

// Message from server
socket.on('message', message => {
    console.log(message)
    outputMessage(message)

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//Message Typing Status
message.addEventListener('keypress', () => {
    socket.emit("typing", patient)
})
socket.on("typing", (name) => {
    feedback.innerHTML = `<h4 style="text-align: left;" >(Typing...)</h4>`;
    setTimeout(() => {
        feedback.innerHTML = ""
    }, 3000)
})

// Message Submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get Message Text
    let msg = e.target.elements.msg.value

    // Emit Message to Server
    msg = msg.trim();
    if (!msg) {
        return false;
    }

    socket.emit('chatMessage', msg)

    // Clear input
    e.target.elements.msg.value="";
    e.target.elements.msg.focus();

})


// Output Message to dom
function outputMessage(message) {
    const div = document.createElement('div')

    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    if(message.username == patient) {
        div.style.backgroundColor = "#DFDFDE"
        div.style.textAlign = 'right'
    }
    message.innerHTML = ""

    document.querySelector('.chat-messages').appendChild(div)

}

//Adds Users to dom
function outputUsers(users, therapist) {
    otherSideName.innerText = therapist 
}