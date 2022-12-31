import {stripe ,CLIENT_URL} from '../index.js'

export const stripePay = async (req, res) => {

  const line_items = req.body.cartItems.map((item)=>{
    return{
      // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
      price_data:{
        currency: "inr",
        product_data:{
          name: item.title.longTitle.substring(0,20)+'...',
          images: [item.url],
          description: item.description.substring(0,50)+'...'
        },
        unit_amount: item.price.cost*100,
      },
      quantity: item.quantity
    }
  })
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    success_url: `${CLIENT_URL}/checkout-success`,
    cancel_url: `${CLIENT_URL}/cart`,
  });
  res.send({url:session.url});
}