function validate(schema) {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (err) {
      const details = err.errors.reduce((acc, error) => {
        const field = error.path[0]; // e.g. "email"
        if (!acc[field]) acc[field] = [];
        acc[field].push(error.message);
        return acc;
      }, {});

      return res.status(400).json({
        error: "Validation failed!",
        details,
      });
    }
  };
}

export default validate;
