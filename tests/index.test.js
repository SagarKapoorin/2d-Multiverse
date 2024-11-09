const axios = require("axios");
const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000"
const WS_URL = "ws://localhost:3001"

function sum(a,b){
    return a+b;
}
test('sum of 1+2 is 3',()=>{
   let ans=sum(1,2);
   expect(ans).toBe(3);
})
describe('Authentication',()=>{
    test('user can sign up',async()=>{
        const username = "SagarKapoor" + Math.random();
        const password = "123456";
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        expect(response.status).toBe(200)
        //should not allow to create user with same username and passward
        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        expect(updatedResponse.status).toBe(400);
    })
    test('Signup request fails if the username is empty', async () => {
        const username = `SagarKapoor-${Math.random()}` 
        const password = "123456"
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            password
        })
        expect(response.status).toBe(400)
    })
    test('Signin succeeds if the username and password are correct', async() => {
        const username = `SagarKapoor-${Math.random()}`
        const password = "123456"

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });
        expect(response.status).toBe(200);
        //should return token also
        expect(response.data.token).toBeDefined();
    })
    test('Signin fails if username and passward is wrong',async()=>{
        const username="SagarKapoor";
        const password="123456";
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            role: "admin"
        });
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: "WrongSagar",
            password
        })
        expect(response.status).toBe(403);
    })
})
describe('User Data get, changed and delete',()=>{
    let token = ""; //token ya it needed to make sure user is auth
    let avatarId = "";
    beforeAll(async () => {
       const username = `SagarKapoor-${Math.random()}`
       const password = "123456"
       await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        username,
        password,
        type: "admin"
       });
       const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
        username,
        password
       })
       token = response.data.token
       const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Sagar1"
        }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        console.log("avatarresponse is " + avatarResponse.data.avatarId)
        avatarId = avatarResponse.data.avatarId;
    })
    test("User cant update their metadata with a wrong avatar id", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId: "123123123"
        }, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(response.status).toBe(400)
    })

    test("User can update their metadata with the right avatar id", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        }, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(response.status).toBe(200)
    })

    test("User is not able to update their metadata if the auth header is not present", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        })

        expect(response.status).toBe(403)
    })
})
