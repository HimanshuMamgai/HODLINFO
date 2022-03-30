import express from "express";
import fetch from "node-fetch";
import mongoose from "mongoose";

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://admin-himanshu:Test123@cluster0.j2qen.mongodb.net/hodlinfoDB?retryWrites=true&w=majority");

const cryptoSchema = new mongoose.Schema({
    name: String,
    last: Number, 
    buy: Number, 
    Sell: Number, 
    volume: Number, 
    base_unit: String
});

const Crypto = mongoose.model("Crypto", cryptoSchema);

app.get("/", (req, res) => {

    fetch("https://api.wazirx.com/api/v2/tickers")
        .then(response => response.json())
        .then((data) => {
            const arr = Object.keys(data);
            arr.forEach((key) => {
                const crypto = new Crypto({
                    name: data[key].name,
                    last: data[key].last, 
                    buy: data[key].buy, 
                    Sell: data[key].sell, 
                    volume: data[key].volume, 
                    base_unit: data[key].base_unit
                });
                crypto.save((err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        Crypto.find({}).limit(10).exec((err, foundCrypto) => {
                            if(err) {
                                console.log(err);
                            } else {
                                res.render("home", {foundCrypto: foundCrypto});
                            }
                        });
                    }
                });
            });
        })
        .catch(err => console.log(err.message));
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});