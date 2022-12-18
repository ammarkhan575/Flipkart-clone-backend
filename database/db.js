
import mongoose from 'mongoose'
mongoose.set('strictQuery', false);
export const Connection = async(username,password)=>{
    const URL=`mongodb+srv://${username}:${password}@ecommerce.ow4s0hg.mongodb.net/?retryWrites=true&w=majority`;
    try{
        await mongoose.connect(URL,{useUnifiedTopology:true,useNewUrlParser:true});
        console.log(`Database connected successfully`);
    }
    catch(error){
        console.log('Error while connecting to database',error.messages);
    }
}

export default Connection;