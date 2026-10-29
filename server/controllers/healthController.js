export const getHome = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the API",
  });
};

export const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
};