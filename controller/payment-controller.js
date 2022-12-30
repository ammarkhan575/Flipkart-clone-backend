
import paytmChecksum from 'paytmchecksum'
import { paytmParams, paytmMerchantKey } from '../index.js'

import formidable from 'formidable';
import https from 'https'
export const addPaymentGateway = async (req,res) =>{
    try{
        let paytmchecksum = await paytmChecksum.generateSignature(paytmParams, paytmMerchantKey);
        let params = {
            ...paytmParams,
            'CHECKSUMHASH': paytmchecksum
        }
        console.log(params);
        res.status(200).json(params);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

export const paytmResponse = (req,res)=>{
    const form = new formidable.IncomingForm();
    let paytmchecksum = req.body.CHECKSUMHASH;
    delete req.body.CHECKSUMHASH;

    let isVerifySignature = paytmChecksum.verifySignature(req.body, paytmMerchantKey, paytmchecksum);
    if(isVerifySignature){
        let paytmParams = {};
        paytmParams['MID'] = req.body.MID;
        paytmParams['ORDER_ID'] = req.body.ORDERID;

        paytmChecksum.generateSignature(paytmParams, paytmMerchantKey).then(function(checksum){
            paytmParams['CHECKSUMHASH']=checksum;

            let post_data = JSON.stringify(paytmParams);
            let options = {
                hostname: 'securegw-stage.paytm.in',
                port: 443,
                path: '/order/status',
                header:{
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            }
            let res='';
            let post_req = https.request(options, function(post_res){
                post_res.on('data',function(chunk){
                    res+=chunk;
                })

                post_res.on('end',function(){
                    let result = JSON.parse(res);
                    response.redirect('http://localhost:3000/')
                })
            })
            post_req.write(post_data);
            post_req.end();
        })
    }else{
        console.log('Checksum mismatched')
    }
}