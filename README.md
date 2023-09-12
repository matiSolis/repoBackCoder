/- para lanzar el servidor:
    npm start   

agregar un .en.example con toda la estructura del .env sin las pass y todo eso

------------------------------------------------------------------------------------------------------------









export const rolPremiumAdminAcces = (req, res, next) => {
  if (
    req.session.user.role !== "admin" &&
    req.session.user.role !== "premium"
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};






































matiSolis