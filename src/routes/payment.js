/* eslint-disable prettier/prettier */
/**
 * Created by vinhnt on 6/16/2017.
 */
const NodeCache = require('node-cache')

const myCache = new NodeCache({ stdTTL: 100, checkperiod: 60 })
const express = require('express')
const Order = require('../app/models/Order')
const router = express.Router()
const $ = require('jquery')
const { requireSignin } = require('../middleware')
const accessKey = 'F8BBA842ECF85'
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
const orderInfo = 'pay with MoMo'
const partnerCode = 'MOMO'
const redirectUrl = 'http://localhost:3000/ReturnURL'
const ipnUrl = 'https://shoplaptopv1.herokuapp.com/api/checkResponse'
const requestType = 'payWithMethod'
const orderId = partnerCode + new Date().getTime()
const requestId = orderId
const extraData = ''
const orderGroupId = ''
const autoCapture = true
const lang = 'vi'
const crypto = require('crypto')
const Cart = require('../app/models/Cart')
const amount = 500000
router.post('/checkResponse', (req, res) => {
    try {
        const { body } = req
        // eslint-disable-next-line no-use-before-define, no-shadow
        const partnerCode = partnerCode
        // eslint-disable-next-line no-use-before-define, no-shadow
        const accessKey = accessKey
        const Secretkey = secretKey
        // eslint-disable-next-line no-shadow
        const { orderId } = body
        // eslint-disable-next-line no-shadow
        const { requestId } = body
        // eslint-disable-next-line no-shadow
        const { orderInfo } = body
        const { orderType } = body
        const { transId } = body
        const { resultCode } = body
        const { message } = body
        const { payType } = body
        const { responseTime } = body
        // eslint-disable-next-line no-shadow
        const { extraData } = body

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`

        // signature
        // eslint-disable-next-line no-shadow, global-require
        const crypto = require('crypto')
        const signature = crypto
            .createHmac('sha256', Secretkey)
            .update(rawSignature)
            .digest('hex')
        console.log(signature)
        console.log(body.signature)
        if (signature === body.signature && body.resultCode === 0) {
            // handle update đơn hàng
            console.log('dúng r nè')

            return res.status(200).end()
        }
        return res.status(400).end()
    } catch (error) {
        return res.status(500).end()
    }
})
router.post('/momo', (req, res) => {
    console.log(req.body)
    myCache.set(`${orderId}`, req.body)
    const rawSignature = `accessKey=${accessKey}&amount=${req.body.totalAmount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`
    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex')
    console.log('--------------------SIGNATURE----------------')
    console.log(signature)
    const requestBody = JSON.stringify({
        partnerCode,
        partnerName: 'Laptop Shop',
        storeId: 'MomoTestStore',
        requestId,
        amount: req.body.totalAmount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        orderGroupId,
        signature,
    })
    // eslint-disable-next-line global-require
    const https = require('https')
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
        },
        data: requestBody,
    }
    // Send the request and get the response
    const reqChild = https.request(options, (resChild) => {
        console.log(`Status: ${resChild.statusCode}`)
        console.log(`Headers: ${JSON.stringify(resChild.headers)}`)
        resChild.setEncoding('utf8')
        resChild.on('data', (body) => {
            console.log('Body: ')
            console.log(body)
            console.log('resultCode: ')
            console.log(JSON.parse(body).resultCode)
            res.header('Access-Control-Allow-Origin')
            return res.json(JSON.parse(body).payUrl)
        })

        resChild.on('end', () => {
            console.log('No more data in response.')
        })
    })
    reqChild.on('error', (e) => {
        console.log(`problem with request: ${e.message}`)
    })
    // write data to request body
    console.log('Sending....')
    reqChild.write(requestBody)
    reqChild.end()
})
router.post('/momoUpdateOrder', requireSignin, (req, res) => {
    try {
        const orderIdUpdate = req.body.orderId
        const orderDetails = myCache.get(orderIdUpdate)
        console.log(orderDetails)
        orderDetails.id = orderIdUpdate
        orderDetails.paymentType = 'card'
        orderDetails.orderStatus = [
            {
                type: 'ordered',
                date: new Date(),
                isCompleted: true,
            },
            {
                type: 'packed',
                isCompleted: false,
            },
            {
                type: 'shipped',
                isCompleted: false,
            },
            {
                type: 'delivered',
                isCompleted: false,
            },
        ]
        const order = new Order(orderDetails)
        order.user = req.user.id
        order.save((error, orderSave) => {
            if (error) return res.status(400).json({ error })
            if (orderSave) {
                console.log(orderSave)
                Cart.deleteMany({ user: orderSave.user }).exec()
                res.status(201).json({ orderSave })
            }
        })
    } catch (error) {
        return res.status(400).json({ error })
    }
})
function sortObject(obj) {
    const sorted = {}
    const str = []
    let key
    // eslint-disable-next-line no-restricted-syntax
    for (key in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key))
        }
    }
    str.sort()
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            '+'
        )
    }
    return sorted
}

module.exports = router
