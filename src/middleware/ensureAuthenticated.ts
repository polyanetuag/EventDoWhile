import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization

  //verificação se o token é válido
  if(!authToken) {
    return response.status(401).json({
      errorCode: "token.invalid"
    })
  }

  //estrutura do token: Bearer dgd83642b9c74977bv040bv3bv7v
  const [, token ] = authToken.split(" ")

  try{
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload

    request.user_id = sub
    return next()
  }catch(err) {
    return response.status(401).json({ errorCode: "token.expired"})
  }
}
