let IS_PROD = true

const server = IS_PROD?
"https://convosphere-o82j.onrender.com":
    "http://localhost:8000";


export default server;