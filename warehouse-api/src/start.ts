import app from "./server";

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Warehouse API is running on port ${port}`);
});