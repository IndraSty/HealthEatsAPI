import { app } from "./application/app.js";

const port = process.env.PORT || 5000;


app.listen(port, () => console.log(`server running on http://localhost:${port}`));