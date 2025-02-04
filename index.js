import express from "express";
import cors from "cors";
import axios from "axios";

const PORT = process.env.PORT || 3000;
const NUMBERS_API_BASE_URL =process.env.NUMBERS_API_BASE_URL || "http://numbersapi.com";

const app = express();
app.use(cors());

const isValidInteger = (num) => /^-?\d+$/.test(num);
const sumDigits = (num) => 
num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
const checkPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0)
            return false;
    }
    return true;
};
const checkPerfect = (num) => {
    if (num <= 1) return false;
    let sum = 0;
    for (let i = 1; i <= num / 2; i++) {
        if (num % i === 0) 
            sum += i;
        }
    return sum === num;
}
const checkArmstrong = (num) => {
    const digits = num.toString().split("");
    const numDigits = digits.length;
    const sum = digits.reduce((sum, digit) => sum + parseInt(digit) ** numDigits, 0);
    return sum === num;
};

app.get("/api/number/:num", async (req, res) => {
    const num = req.params.num;
    if (!isValidInteger(num)) {
        return res.status(400).json({ error: "Invalid input. please enter a valid integer." });
    }
    const number = parseInt(num, 10);
    const isEven = number % 2 === 0;
    const isOdd = !isEven;
    const isArmstrong = checkArmstrong(number);
    const isPrime = checkPrime(number);
    const isPerfect = checkPerfect(number);
    const digitSum = sumDigits(number);

    const properties = [];
    if (isArmstrong) properties.push("armstrong");
    properties.push(isEven ? "even" : "odd");

    let funFact = "No fun fact available";
    try {
        const response = await axios.get(`${NUMBERS_API_BASE_URL}/${number}`);
        funFact = response.data;
    } catch (error) {
        console.error("Failed to fetch fun fact", error);
    }

    res.json({
        number,
        is_Prime: isPrime,
        is_Perfect: isPerfect,
        properties,
        digit_Sum: digitSum,
        fun_Fact: funFact
    });
});

app.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`));
    