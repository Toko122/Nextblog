import jwt from 'jsonwebtoken';

export const getUserIdFromToken = (req) => {
      const authHeader = req.headers.get("authorization")
      if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new Error('Unauthorized')
      }

      const token = authHeader.split(' ')[1]

      try{
         const decoded = jwt.verify(token, process.env.JWT)
         return decoded.id
      }catch(err){
       throw new Error('Invalid token')
    }

      
}