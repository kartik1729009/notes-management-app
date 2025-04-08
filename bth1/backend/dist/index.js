"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const dbconnect_1 = require("./config/dbconnect");
const routes_1 = __importDefault(require("./routes/routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, dbconnect_1.dbConnect)();
app.get('/', (req, res) => {
    res.send("this is a get request by send");
});
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/auth", routes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running successfully on PORT: ${PORT}`);
});
