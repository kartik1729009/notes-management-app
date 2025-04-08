"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = require("./config/connect");
const routes_1 = __importDefault(require("./routes/routes"));
(0, connect_1.dbConnect)();
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("this is a get route");
});
app.use("/api/v1", routes_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server running successfully at port no: ${PORT}`);
});
