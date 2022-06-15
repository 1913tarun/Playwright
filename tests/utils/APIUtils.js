class APIUtils
{
    constructor(apiContext,loginPayLoad)
    {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }
    async getToken()
    {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
        {
            data : this.loginPayLoad
        })
        // //200/201/202..
        // expect(loginResponse.ok()).toBeTruthy();
        const loginResponseJson = await loginResponse.json();
        //    loginResponse.body  or loginResponse.headers ; loginResponse.status
        const token = await loginResponseJson.token;
        console.log(token);
        return token;
    }

    async createOrder(orderPayLoad)
    {
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data:orderPayLoad,
            headers : {
                        'Authorization' : response.token,
                        'Content-Type' : 'application/json'
                    },
        })
        const orderResponseJson = await orderResponse.json();
        let orderID = await orderResponseJson.orders[0];
        response.orderID = orderID;
        console.log(orderID);
        return response;
    }
}

module.exports = {APIUtils};