app.use("/tickets", express.static("tickets"));

app.get("/", (req, res) => {
  res.send("DNS Event Backend Live ✅");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
