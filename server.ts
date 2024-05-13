import { app, port } from "./src";

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});