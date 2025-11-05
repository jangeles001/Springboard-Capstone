function validate(schema) {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (err) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors.map((e) => e.message),
      });
    }
  };
}

export default validate;
